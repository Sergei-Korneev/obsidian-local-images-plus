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
  MD_SEARCH_PATTERN,
  ANY_URL_PATTERN,
  NOTICE_TIMEOUT,
  TIMEOUT_LIKE_INFINITY,
} from "./config";
import { UniqueQueue } from "./uniqueQueue";
import path from "path";

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

    let prefsuff = this.settings.mediaFolderSuff.split("|");
    
    prefsuff.length === 1 ? prefsuff=["",""]: null ;
    const obsmediadir = this.app.vault.getConfig("attachmentFolderPath");
    const mediadir = this.settings.mediaRootDirectory;
    const attdir = this.settings.saveAtt;
    let root="./";
          switch (attdir) {
            case 'nextToNote':
               root = path.join(file.parent.path, prefsuff[0] + file.basename + prefsuff[1] );
              break;
            
            case 'inFolderBelow':
               root = mediadir;
              break;

            case 'nextToNoteS':
              root = path.join(file.parent.path,mediadir);
              break;

            case 'nextToNoteSub':
              root = path.join(file.parent.path, mediadir, prefsuff[0] + file.basename + prefsuff[1]);
              break;
            default:
            
            if ( obsmediadir === '/' ){
                  root = obsmediadir;
            }
            else if ( obsmediadir === './' ){
                  root = path.join(file.parent.path);
            }
            else if  ( obsmediadir.match (/\.\/.+/g) !== null ) {
                  root = path.join(file.parent.path, obsmediadir.replace('\.\/',''));
            }
            else{
                  root = obsmediadir;
            }

          }

    const content = await this.app.vault.cachedRead(file);

    await this.ensureFolderExists(root);
    const fixedContent = await replaceAsync(
      content,
      MD_SEARCH_PATTERN,
      imageTagProcessor(this.app,
                        root,
                        this.settings.useWikilinks,
                        this.settings.addNameOfFile,
                        this.settings.filesizeLimit,
                        this.settings.downUnknown,
                        this.settings.useRelativePath
                       )
    );

    if (content != fixedContent[0] && fixedContent[1] === false ) {
      this.modifiedQueue.remove(file);
      await this.app.vault.modify(file, fixedContent[0]);

      if (this.settings.showNotifications) {
        new Notice(`Attachements for "${file.path}" were processed.`);
      }
    }
    else if (content != fixedContent[0] && fixedContent[1] === true ) {
    
      this.modifiedQueue.remove(file);
      await this.app.vault.modify(file, fixedContent[0]);

      if (this.settings.showNotifications) {
        new Notice(`WARNING!\r\nAttachements for "${file.path}" were processed, but some attachements were not downloaded/replaced due to errors...`);
      }

    }
    else {
      if (this.settings.showNotifications) {
        new Notice(
          `Page "${file.path}" has been processed, but nothing was changed.`
        );
      }
    }
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
      notice.setMessage(`Local Images Plus: ${pagesCount} pages were processed.`);

      setTimeout(() => {
        notice.hide();
      }, NOTICE_TIMEOUT);
    }
  };
  async onload() {
    await this.loadSettings();

    this.addCommand({
      id: "download-images",
      name: "Download all media files",
      callback: this.processActivePage,
    });

    this.addCommand({
      id: "download-images-all",
      name: "Download media files for all your notes",
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
                         this.setupQueueInterval();
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
      1//this.settings.realTimeAttemptsToProcess
    );
  }
  // It is good idea to create the plugin more verbose
  displayError(error: Error | string, file?: TFile): void {
    if (file) {
      new Notice(
        `LocalImagesPlus: Error while handling file ${
          file.name
        }, ${error.toString()}`
      );
    } else {
      new Notice(error.toString());
    }

    logError(`LocalImagesPlus: error: ${error}`, false);
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

  displSw(cont: any): void {
                cont.findAll(".setting-item").forEach((el: any) => {
                 if (el.getAttr("class").includes("media_folder_set")  ){

                          if (this.plugin.settings.saveAtt === "obsFolder" ||
                              this.plugin.settings.saveAtt === "nextToNote" ){
                              el.hide();
                          }
                          else{
                              el.show();
                          }
                     }

                 if (el.getAttr("class").includes("media_folder_suff")  ){

                          if (this.plugin.settings.saveAtt === "nextToNoteSub" ||
                              this.plugin.settings.saveAtt === "nextToNote" ){
                              el.show();
                          }
                          else{
                              el.hide();
                          }
                     }
                });
   }

  display(): void {
    let { containerEl } = this;
   


    containerEl.empty();


    containerEl.createEl("h2", { text: "Local Images Plus" + " 0.14.8" });

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
      .setDesc("Interval in seconds for processing update. It takes some time to reveal changed content of a note to plugins.")
      .addText((text) =>
        text
          .setValue(String(this.plugin.settings.realTimeUpdateInterval))
          .onChange(async (value: string) => {

            let numberValue = Number(value);
            if (
              isNaN(numberValue) ||
              !Number.isInteger(numberValue) ||
              numberValue <= 5 ||
              numberValue > 3600
            ) {


              this.plugin.displayError(

                "Realtime processing interval should be a positive integer number between 5 and 3600!"
              );
              return;
            }

            if ( numberValue < 5 ){
               numberValue = 5;
            }
            this.plugin.settings.realTimeUpdateInterval = numberValue;
            await this.plugin.saveSettings();
            this.plugin.setupQueueInterval();
          })
      );

    new Setting(containerEl)
      .setName("File size lower limit in Kb")
      .setDesc("Do not download files with size less than this value. Set 0 for no limit.")
      .addText((text) =>
        text
          .setValue(String(this.plugin.settings.filesizeLimit))
          .onChange(async (value: string) => {

            let numberValue = Number(value);
            if (
              isNaN(numberValue) ||
              !Number.isInteger(numberValue) ||
              numberValue < 0 
            ) {


              this.plugin.displayError(

                "The value should be a positive integer!"
              );
              return;
            }

            if ( numberValue < 0 ){
               numberValue = 0;
            }
            this.plugin.settings.filesizeLimit = numberValue;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Add original filename as a markdown link before tag")
      .setDesc("Add [[original filename]] or [original filename](link to attachement) before replaced tag (only for file:// protocol).")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.addNameOfFile)
          .onChange(async (value) => {
            this.plugin.settings.addNameOfFile = value;
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
      .setName("Do not use relative paths in tags")
      .setDesc("Use base filename in replaced links.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.useRelativePath)
          .onChange(async (value) => {
            this.plugin.settings.useRelativePath = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Download unknown filetypes")
      .setDesc("Download unknown filetypes and save them with .unknown extension.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.downUnknown)
          .onChange(async (value) => {
            this.plugin.settings.downUnknown = value;
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
      .setName("Folder to save new attachements.")
      .setDesc(
        "Select where all new attachements will be saved."
      )
      .addDropdown((text) => 
        text
                    .addOption("obsFolder", "Copy Obsidian settings")
                    .addOption("inFolderBelow", "In the root folder specified below")
                    .addOption("nextToNoteS", "Next to note in folder specified below")
                    .addOption("nextToNote", "Next to note in ${notename}")
                    .addOption("nextToNoteSub", "Next to note in folder specified below in subfolder called ${notename}")
                    .setValue(this.plugin.settings.saveAtt)

          .onChange(async (value) => {
              this.plugin.settings.saveAtt= value;
                 this.displSw(containerEl);

          await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Media folder")
      .setDesc("Folder to keep all downloaded media files.")
      .setClass("media_folder_set")
      .addText((text) =>
        text
          .setValue(this.plugin.settings.mediaRootDirectory)
          .onChange(async (value) => {

          if (value.match(/(\)|\(|\"|\'|\#|\]|\[|\:|\>|\<|\*|(\\|\/|\|))/g) !== null )  {
            this.plugin.displayError(
              "Unsafe folder name! Some chars are forbidden in some filesystems."
            );
            return;
          }
            this.plugin.settings.mediaRootDirectory = value;
          await this.plugin.saveSettings();
        })

      );

    new Setting(containerEl)
      .setName("${notename} folder suffixation")
      .setDesc("Select folder prefix or suffix (20 chars max). Syntax: prefix|suffix. Or leave this field blank.")
      .setClass("media_folder_suff")
      .addText((text) =>
        text
          .setValue(this.plugin.settings.mediaFolderSuff)
          .onChange(async (value) => {
          const val = value.match(/(^.{0,20}\|.{0,20}$|^$)/g);

          if (! val )  {
            this.plugin.displayError(
              "Wrong pattern!"
            );
            return;
          }

          else if (val[0].replace("\|","").match(/(\)|\(|\"|\'|\#|\]|\[|\:|\>|\<|\*|(\\|\/|\|))/g) !== null )  {
            this.plugin.displayError(
              "Unsafe folder name! Some chars are forbidden in some filesystems."
            );
            return;
          }


          this.plugin.settings.mediaFolderSuff = value;
          await this.plugin.saveSettings();
        })

      );
                 this.displSw(containerEl);
  }
}
