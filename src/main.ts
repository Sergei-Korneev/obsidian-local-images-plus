import {
  App,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  TFile,
} from "obsidian";
import safeRegex from "safe-regex";

import { imageTagProcessor } from "./contentProcessor";
import { replaceAsync, cleanContent } from "./utils";
import {
  ISettings,
  DEFAULT_SETTINGS,
  EXTERNAL_MEDIA_LINK_PATTERN,
  ANY_URL_PATTERN,
  NOTICE_TIMEOUT,
  TIMEOUT_LIKE_INFINITY,
} from "./config";
import { UniqueQueue } from "./uniqueQueue";

export default class LocalImagesPlugin extends Plugin {
  settings: ISettings;
  modifiedQueue = new UniqueQueue<TFile>();
  intervalId: number = null;

  private async proccessPage(file: TFile, silent = false) {
    // const content = await this.app.vault.read(file);
    const content = await this.app.vault.cachedRead(file);

    await this.ensureFolderExists(this.settings.mediaRootDirectory);

    const cleanedContent = this.settings.cleanContent
      ? cleanContent(content)
      : content;
    const fixedContent = await replaceAsync(
      cleanedContent,
      EXTERNAL_MEDIA_LINK_PATTERN,
      imageTagProcessor(this.app, this.settings.mediaRootDirectory, this.settings.useWikilinks)
    );

    if (content != fixedContent) {
      this.modifiedQueue.remove(file);
      await this.app.vault.modify(file, fixedContent);

      if (!silent && this.settings.showNotifications) {
        new Notice(`Images for "${file.path}" were processed.`);
      }
    } else {
      if (!silent && this.settings.showNotifications) {
        new Notice(
          `Page "${file.path}" has been processed, but nothing was changed.`
        );
      }
    }
  }

  // using arrow syntax for callbacks to correctly pass this context
  processActivePage = async () => {
    const activeFile = this.app.workspace.getActiveFile();
    await this.proccessPage(activeFile);
  };

  processAllPages = async () => {
    const files = this.app.vault.getMarkdownFiles();
    const includeRegex = new RegExp(this.settings.include, "i");

    const pagesCount = files.length;

    const notice = this.settings.showNotifications
      ? new Notice(
          `Local Images \nStart processing. Total ${pagesCount} pages. `,
          TIMEOUT_LIKE_INFINITY
        )
      : null;

    for (const [index, file] of files.entries()) {
      if (file.path.match(includeRegex)) {
        if (notice) {
          // setMessage() is undeclared but factically existing, so ignore the TS error
          // @ts-expect-error
          notice.setMessage(
            `Local Images: Processing \n"${file.path}" \nPage ${index} of ${pagesCount}`
          );
        }
        await this.proccessPage(file, true);
      }
    }
    if (notice) {
      // @ts-expect-error
      notice.setMessage(`Local Images: ${pagesCount} pages were processed.`);

      setTimeout(() => {
        notice.hide();
      }, NOTICE_TIMEOUT);
    }
  };

  async onload() {
    await this.loadSettings();

    this.addCommand({
      id: "download-images",
      name: "Download images locally",
      callback: this.processActivePage,
    });

    this.addCommand({
      id: "download-images-all",
      name: "Download images locally for all your notes",
      callback: this.processAllPages,
    });

    this.registerCodeMirror((cm: CodeMirror.Editor) => {
      // on("beforeChange") can not execute async function in event handler, so we use queue to pass modified pages to timeouted handler
      cm.on("change", async (instance: CodeMirror.Editor, changeObj: any) => {
        if (
          changeObj.origin == "paste" &&
          ANY_URL_PATTERN.test(changeObj.text)
        ) {
          this.enqueueActivePage();
        }
      });
    });

    this.setupQueueInterval();

    this.addSettingTab(new SettingTab(this.app, this));
  }

  setupQueueInterval() {
    if (this.intervalId) {
      const intervalId = this.intervalId;
      this.intervalId = null;
      window.clearInterval(intervalId);
    }
    if (
      this.settings.realTimeUpdate &&
      this.settings.realTimeUpdateInterval > 0
    ) {
      this.intervalId = window.setInterval(
        this.processModifiedQueue,
        this.settings.realTimeUpdateInterval
      );
      this.registerInterval(this.intervalId);
    }
  }

  processModifiedQueue = async () => {
    const iteration = this.modifiedQueue.iterationQueue();
    for (const page of iteration) {
      this.proccessPage(page);
    }
  };

  enqueueActivePage() {
    const activeFile = this.app.workspace.getActiveFile();
    this.modifiedQueue.push(
      activeFile,
      this.settings.realTimeAttemptsToProcess
    );
  }
  // It is good idea to create the plugin more verbose
  displayError(error: Error | string, file?: TFile): void {
    if (file) {
      new Notice(
        `LocalImages: Error while handling file ${
          file.name
        }, ${error.toString()}`
      );
    } else {
      new Notice(error.toString());
    }

    console.error(`LocalImages: error: ${error}`);
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    this.setupQueueInterval();
  }

  async saveSettings() {
    try {
      await this.saveData(this.settings);
    } catch (error) {
      this.displayError(error);
    }
  }

  async ensureFolderExists(folderPath: string) {
    try {
      await this.app.vault.createFolder(folderPath);
    } catch (error) {
      if (!error.message.contains("Folder already exists")) {
        throw error;
      }
    }
  }
}

class SettingTab extends PluginSettingTab {
  plugin: LocalImagesPlugin;

  constructor(app: App, plugin: LocalImagesPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", { text: "Local images" });

    new Setting(containerEl)
      .setName("On paste processing")
      .setDesc("Process active page if external link was pasted.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.realTimeUpdate)
          .onChange(async (value) => {
            this.plugin.settings.realTimeUpdate = value;
            await this.plugin.saveSettings();
            this.plugin.setupQueueInterval();
          })
      );

    new Setting(containerEl)
      .setName("On paste processing interval")
      .setDesc("Interval in milliseconds for processing update.")
      .setTooltip(
        "I could not process content on the fly when it is pasted. So real processing implements periodically with the given here timeout."
      )
      .addText((text) =>
        text
          .setValue(String(this.plugin.settings.realTimeUpdateInterval))
          .onChange(async (value: string) => {
            const numberValue = Number(value);
            if (
              isNaN(numberValue) ||
              !Number.isInteger(numberValue) ||
              numberValue < 0
            ) {
              this.plugin.displayError(
                "Realtime processing interval should be a positive integer number!"
              );
              return;
            }
            this.plugin.settings.realTimeUpdateInterval = numberValue;
            await this.plugin.saveSettings();
            this.plugin.setupQueueInterval();
          })
      );

    new Setting(containerEl)
      .setName("Attempts to process")
      .setDesc(
        "Number of attempts to process content on paste. For me 3 attempts is enouth with 1 second update interval."
      )
      .setTooltip(
        "I could not find the way to access newly pasted content immediatily, after pasting, Plugin's API returns old text for a while. The workaround is to process page several times until content is changed."
      )
      .addText((text) =>
        text
          .setValue(String(this.plugin.settings.realTimeAttemptsToProcess))
          .onChange(async (value: string) => {
            const numberValue = Number(value);
            if (
              isNaN(numberValue) ||
              !Number.isInteger(numberValue) ||
              numberValue < 1 ||
              numberValue > 100
            ) {
              this.plugin.displayError(
                "Realtime processing interval should be a positive integer number greater than 1 and lower than 100!"
              );
              return;
            }
            this.plugin.settings.realTimeAttemptsToProcess = numberValue;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Clean content")
      .setDesc("Clean malformed image tags before processing.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.cleanContent)
          .onChange(async (value) => {
            this.plugin.settings.cleanContent = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Show notifications")
      .setDesc("Show notifications when pages were processed.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showNotifications)
          .onChange(async (value) => {
            this.plugin.settings.showNotifications = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Use wikilinks format")
      .setDesc("Use ![[]] format for replaced links.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.useWikilinks)
          .onChange(async (value) => {
            this.plugin.settings.useWikilinks = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Include")
      .setDesc(
        "Include only files matching this regex pattern when running on all notes."
      )
      .addText((text) =>
        text.setValue(this.plugin.settings.include).onChange(async (value) => {
          if (!safeRegex(value)) {
            this.plugin.displayError(
              "Unsafe regex! https://www.npmjs.com/package/safe-regex"
            );
            return;
          }
          this.plugin.settings.include = value;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName("Media folder")
      .setDesc("Folder to keep all downloaded media files.")
      .addText((text) =>
        text
          .setValue(this.plugin.settings.mediaRootDirectory)
          .onChange(async (value) => {
            this.plugin.settings.mediaRootDirectory = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
