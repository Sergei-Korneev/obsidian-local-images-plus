import {
  App,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  TFile,
  Editor,
  htmlToMarkdown,
  MarkdownView,
} from "obsidian";
//import * as CodeMirror from "codemirror";
import safeRegex from "safe-regex";

import { 
  imageTagProcessor,
} from "./contentProcessor";

import { 
  replaceAsync, 
  readFromDisk,
  logError
} from "./utils";

import {
  ISettings,
  DEFAULT_SETTINGS,
  MD_MEDIA_LINK,
  ANY_URL_PATTERN,
  NOTICE_TIMEOUT,
  TIMEOUT_LIKE_INFINITY,
} from "./config";
import { UniqueQueue } from "./uniqueQueue";

export default class LocalImagesPlugin extends Plugin {
  settings: ISettings;
  modifiedQueue = new UniqueQueue<TFile>();
  intervalId: number = null;

  private async processPage(file: TFile): Promise<any>  {
    logError(file,true);
    if ( file  == null ) {
      if (this.settings.showNotifications) {
        new Notice(`Empty note!`);
        return null;
      }
    }

    const content = await this.app.vault.cachedRead(file);

    let root = this.settings.mediaRootDirectory;
    if (this.settings.saveAttNextToNote){
           root = file.path + "_res";
    }
    await this.ensureFolderExists(root);
    const fixedContent = await replaceAsync(
      content,
      MD_MEDIA_LINK,
      imageTagProcessor(this.app,
                        root,
                        this.settings.useWikilinks,
                        this.settings.addNameOfFile)
    );

    if (content != fixedContent) {
      this.modifiedQueue.remove(file);
      await this.app.vault.modify(file, fixedContent);

      if (this.settings.showNotifications) {
        new Notice(`Attachements for "${file.path}" were processed.`);
      }
    }
//    else {
//      if (this.settings.showNotifications) {
//        new Notice(
//          `Page "${file.path}" has been processed, but nothing was changed.`
//        );
//      }
//    }
  }

  // using arrow syntax for callbacks to correctly pass this context
  processActivePage = async () => {
    const activeFile = this.app.workspace.getActiveFile();
       await this.processPage(activeFile);
  };

  processAllPages = async () => {
    const files = this.app.vault.getMarkdownFiles();

    
    const includeRegex = new RegExp(this.settings.include, "i");

    const pagesCount = files.length;

    const notice = this.settings.showNotifications
      ? new Notice(
          `Local Images Plus \nStart processing. Total ${pagesCount} pages. `,
          TIMEOUT_LIKE_INFINITY
        )
      : null;

    for (const [index, file] of files.entries()) {
      if (file.path.match(includeRegex)) {
        if (notice) {
          //setMessage() is undeclared but factically existing, so ignore the TS error  //@ts-expect-error
          notice.setMessage(
            `Local Images Plus: Processing \n"${file.path}" \nPage ${index} of ${pagesCount}`
          );
        }
        await this.processPage(file);
      }
    }
    if (notice) {
      // dum @ts-expect-error
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
    this.app.workspace.on(
      "editor-paste",
        ( evt: ClipboardEvent, editor: Editor, info: MarkdownView) => {
          if (this.settings.realTimeUpdate)  {
              const conthtml = htmlToMarkdown(evt.clipboardData.getData("text/html"));
              const contmd = htmlToMarkdown(evt.clipboardData.getData("text"));
                if (MD_MEDIA_LINK.test(conthtml) ||
                    MD_MEDIA_LINK.test(contmd) ){
                    if (this.settings.showNotifications) {
                      new Notice("Media links were found, processing...");
                    }
                       this.enqueueActivePage();
           }
      }
        }
    );

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
        this.settings.realTimeUpdateInterval*1000
      );
      this.registerInterval(this.intervalId);
    }
  }
  


  processModifiedQueue = async () => {
    const iteration = this.modifiedQueue.iterationQueue();
    for (const page of iteration) {
      this.processPage(page);
    }
  };

  enqueueActivePage() {
    const activeFile = this.app.workspace.getActiveFile();
    this.modifiedQueue.push(
      activeFile,
      4//this.settings.realTimeAttemptsToProcess
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

    logError(`LocalImages: error: ${error}`, false);
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

//
// Settings tab
//

class SettingTab extends PluginSettingTab {
  plugin: LocalImagesPlugin;

  constructor(app: App, plugin: LocalImagesPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", { text: "Local Images Plus" });

    const donheader = containerEl.createEl("div");
    donheader.createEl("a", { text: "Support the project! "  , href:"https://www.buymeacoffee.com/sergeikorneev", cls: "donheader_txt" });
    donheader.createEl("a", { text: " GitHub"  , href:"https://github.com/Sergei-Korneev/obsidian-local-images-plus", cls: "donheader_txt" });


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
      .setDesc("Interval in seconds for processing update.")
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
              numberValue <= 0 ||
              numberValue > 3600
            ) {


              this.plugin.displayError(

                "Realtime processing interval should be a positive integer number between 1 and 3600!"
              );
              return;
            }
            this.plugin.settings.realTimeUpdateInterval = numberValue;
            await this.plugin.saveSettings();
            this.plugin.setupQueueInterval();
          })
      );
//
//    new Setting(containerEl)
//      .setName("Attempts to process")
//      .setDesc(
//        "Number of attempts to process content on paste."
//      )
//      .setTooltip(
//        "."
//      )
//      .addText((text) =>
//        text
//          .setValue(String(this.plugin.settings.realTimeAttemptsToProcess))
//          .onChange(async (value: string) => {
//            const numberValue = Number(value);
//            if (
//              isNaN(numberValue) ||
//              !Number.isInteger(numberValue) ||
//              numberValue < 1 ||
//              numberValue > 100
//            ) {
//              this.plugin.displayError(
//                "Realtime processing interval should be a positive integer number greater than 1 and lower than 100!"
//              );
//              return;
//            }
//            this.plugin.settings.realTimeAttemptsToProcess = numberValue;
//            await this.plugin.saveSettings();
//          })
//      );

    new Setting(containerEl)
      .setName("Add original filename before tag.")
      .setDesc("Add **original filename** before replaced tag (only for file:// protocol).")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.addNameOfFile)
          .onChange(async (value) => {
            this.plugin.settings.addNameOfFile = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Save attachments next to note.")
      .setDesc("Put all new attachements in ${notepath}.md_res directory.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.saveAttNextToNote)
          .onChange(async (value) => {
            this.plugin.settings.saveAttNextToNote = value;
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
