import {
  App,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  Menu,
  TFile,
  Editor,
  htmlToMarkdown,
  MarkdownView,
} from "obsidian";
//import * as CodeMirror from "codemirror";
import safeRegex from "safe-regex";

import { 
  imageTagProcessor,
  getMDir,
  getRDir
} from "./contentProcessor";

import { 
  replaceAsync, 
  copyFromDisk,
  readFromDisk,
  cleanFileName,
  md5Sig,
  logError
} from "./utils";

import {
  APP_TITLE,
  ISettings,
  DEFAULT_SETTINGS,
  MD_SEARCH_PATTERN,
  ANY_URL_PATTERN,
  NOTICE_TIMEOUT,
  TIMEOUT_LIKE_INFINITY,
} from "./config";
import { UniqueQueue } from "./uniqueQueue";
import path from "path";
import {ModalW1} from "./modal"; 

export default class LocalImagesPlugin extends Plugin {
  settings: ISettings;
  modifiedQueue = new UniqueQueue<TFile>();
  intervalId: number = null;


private async processClip(file: TFile, obj: DragEvent | ClipboardEvent, editor: Editor ){

  if (this.settings.showNotifications) {
    new Notice(APP_TITLE+"\nProcessing clipboard...");
  };
 logError(obj,true);

  const pat =  await getMDir(this.app, file, this.settings);
  const files = [];
  let openf = "";

   if (obj.constructor.name == "DragEvent" ){
      const fItems = obj.dataTransfer.files;
      const tItems = obj.dataTransfer.items;

 logError(obj.dataTransfer,true);
 logError(tItems,true);
 logError(fItems,true);
        for (const key in tItems) {
        if ( tItems[key].kind == "file" ){
          
          if (fItems[key].path !== '' ){
            files.push(fItems[key].path);
          }
        }
      }
     }

   if (obj.constructor.name == "ClipboardEvent" ){

      const fItems = obj.clipboardData.files;
      const tItems = obj.clipboardData.items;

 logError(obj.clipboardData,true);
 logError(tItems,true);
 logError(fItems,true);
      for (const key in tItems) {
      if ( tItems[key].kind == "file" ){
        
        if (fItems[key].path !== '' ){
          files.push(fItems[key].path);
        }
        else{

logError("File:\n",false);

logError(fItems,true);
          const blob = await tItems[key].getAsFile();
          const binData =  await blob.arrayBuffer();
          const ext =  path.extname(fItems[key]["name"]);
          const fpath =  path.join(pat, md5Sig(binData) + ext );
          const rdir = await getRDir(file, this.settings, fpath);

          await this.ensureFolderExists(pat.replace(/\\/g, "/"));
          this.app.vault.adapter.writeBinary(fpath.replace(/\\/g, "/"), binData);


              if (this.settings.useWikilinks){
                  if (this.settings.addNameOfFile){openf = "\r\n[[" + rdir[0] + "|Open file:]]"};
                  editor.replaceRange(openf + "\r\n![[" + rdir[0] + "]]\r\n", editor.getCursor());
              }
              
              else{
                  if (this.settings.addNameOfFile){openf = "\r\n[Open file:]" + "(" + rdir[1] + ")"};
                  editor.replaceRange(openf + "\r\n![](" + rdir[1] + ")\r\n", editor.getCursor());
              }

              this.app.workspace.activeLeaf.rebuildView();
          return;
        }

          }
      }

 }


for (const file_ of files) {

          const fpath_ = path.join(pat,path.basename(file_).replace(/(\)|\(|\"|\'|\#|\]|\[|\:|\>|\<|\*|\|)/g,"_"));
          const rdir_ = await getRDir(file, this.settings, fpath_);

              const ex = await app.vault.adapter.exists(fpath_);
             var res = true;
              if (!ex) {

               await this.ensureFolderExists(pat);
               res = await copyFromDisk(file_, path.join(this.app.vault.adapter.basePath, fpath_));
             } 

             if (res !== null  ||  ex ){
                    if (this.settings.useWikilinks){
                        
                      if (this.settings.addNameOfFile){openf = "\r\n[[" + rdir_[0] + "|Open file: "+ path.basename(file_) +"]]"};
                      editor.replaceRange( openf + "\r\n![[" + rdir_[0] + "]]\r\n", editor.getCursor());

                    }
                    
                    else{

                        if (this.settings.addNameOfFile){openf = "\r\n[Open file: " + path.basename(file_) + "]" + "(" + rdir_[1] + ")"};
                        editor.replaceRange(openf + "\r\n![](" + rdir_[1] + ")\r\n", editor.getCursor());

                    }
               }

             
}
              this.app.workspace.activeLeaf.rebuildView();

}

  private async processPage(file: TFile): Promise<any>  {

    logError(file,true);
    if ( file  == null ) {
      if (this.settings.showNotifications) {
        new Notice(APP_TITLE  + `\nEmpty note!`);
        return null;
      }
    }

    var root =  await getMDir(this.app, file, this.settings);
    const content = await this.app.vault.cachedRead(file);
      logError(file.path+"\n\n'"+content+"'");

    logError(root,true);
    await this.ensureFolderExists(root);
    const fixedContent = await replaceAsync(
      content,
      MD_SEARCH_PATTERN,
      imageTagProcessor(this.app,
                        file,
                        this.settings
                       )
    );

    if (content != fixedContent[0] && fixedContent[1] === false ) {
      this.modifiedQueue.remove(file);
      await this.app.vault.modify(file, fixedContent[0]);

      if (this.settings.showNotifications) {
        new Notice( APP_TITLE+`\nAttachements for "${file.path}" were processed.`);
      }
    }
    else if (content != fixedContent[0] && fixedContent[1] === true ) {
    
      this.modifiedQueue.remove(file);
      await this.app.vault.modify(file, fixedContent[0]);

      if (this.settings.showNotifications) {
        new Notice( APP_TITLE+`\nWARNING!\r\nAttachements for "${file.path}" were processed, but some attachements were not downloaded/replaced...`);
      }

    }
    else {
      if (this.settings.showNotifications) {
        new Notice(
           APP_TITLE+`\nPage "${file.path}" has been processed, but nothing was changed.`
        );
      }
    }
  }

  // using arrow syntax for callbacks to correctly pass this context
  processActivePage = async () => {
     logError("processactive"); 
    try{
      const activeFile = app.workspace.activeEditor.file;
      await this.processPage(activeFile);
    }catch(e){
    new Notice( APP_TITLE+`\nPlease select a note or click inside selected note in canvas.`);
    return;
    }
  };

  processAllPages = async () => {
    const files = this.app.vault.getMarkdownFiles();

    
    const includeRegex = new RegExp(this.settings.include, "i");

    const pagesCount = files.length;

    const notice = this.settings.showNotifications
      ? new Notice(
          APP_TITLE+`\nLocal Images Plus \nStart processing. Total ${pagesCount} pages. `,
          TIMEOUT_LIKE_INFINITY
        )
      : null;

    for (const [index, file] of files.entries()) {
      if (file.path.match(includeRegex)) {
        if (notice) {
          //setMessage() is undeclared but factically existing, so ignore the TS error  //@ts-expect-error
          notice.setMessage(
             APP_TITLE+`\nLocal Images Plus: Processing \n"${file.path}" \nPage ${index} of ${pagesCount}`
          );
        }
        await this.processPage(file);
      }
    }
    if (notice) {
      // dum @ts-expect-error
      notice.setMessage( APP_TITLE+`\nLocal Images Plus: ${pagesCount} pages were processed.`);

      setTimeout(() => {
        notice.hide();
      }, NOTICE_TIMEOUT);
    }
  };


private async onDropFunc(evt: DragEvent = undefined, editor: Editor = undefined, info: MarkdownView = undefined){

          if (evt === undefined){return;}

          if (!this.settings.intClip) {return};

                    evt.preventDefault();
                    const activeFile = app.workspace.activeEditor.file;
                    this.processClip(activeFile, evt, editor);
                    return;
} 



private async onPasteFunc(evt: ClipboardEvent = undefined, editor: Editor = undefined, info: MarkdownView = undefined){

          if (evt === undefined){return;}

          if (!this.settings.intClip) {return};

                try{
                  const activeFile = app.workspace.activeEditor.file;
                  const fItems = evt.clipboardData.files;
                  const tItems = evt.clipboardData.items;

                  for (const key in tItems) {

                  // Check if it was a text/html
                  if ( tItems[key].kind == "string" ){

                         if (this.settings.realTimeUpdate)  {
                              const cont = htmlToMarkdown(evt.clipboardData.getData("text/html")) + 
                                           htmlToMarkdown(evt.clipboardData.getData("text"));
                              for (const reg_p of MD_SEARCH_PATTERN) {
                                if (reg_p.test(cont)) {
                                    if (this.settings.showNotifications) {
                                         new Notice( APP_TITLE+"\nMedia links were found, processing...");
                                    }
                                       this.enqueueActivePage(activeFile);
                                        this.setupQueueInterval();
                                        break;
                                 }
                            }
                          }
                    return;
                  }

                  // Check if it is a file(s)
                  if ( tItems[key].kind == "file" ){
                      if (!this.settings.intClip) {return};
                      evt.preventDefault();
                      this.processClip(activeFile, evt, editor);
                      return;
                      }
                  }




                }catch(e){
                new Notice( APP_TITLE+`\nPlease select a note or click inside selected note in canvas.`);
                return;
                }
        


} 

private async onCreateFunc(file: TFile = undefined){

        if (file === undefined){return;}
        const includeRegex = new RegExp(this.settings.include, "i");

				if ( !(file instanceof TFile) || !(this.settings.processCreated))
					return

				if ( !(file.path.match(includeRegex)) )
					return

				const timeGapMs = Date.now() - file.stat.ctime;

				if (timeGapMs > 1000)
					return

					logError( file.path, false)
          const cont =  await this.app.vault.cachedRead(file);
          for (const reg_p of MD_SEARCH_PATTERN) {
               if (reg_p.test(cont)) {
                    this.enqueueActivePage(file);
                    break;
                    return;
               }
          }
}




private fileMenuCallbackFunc = (
        menu: Menu,
    ) => {
                menu.addSeparator();
                menu.addItem((item) => {
                    item.setTitle("Download media files")
                        .setIcon('link')
                        .onClick( async () => {
                          this.processActivePage();
                        });
                });
            menu.addSeparator();
    };



private openModal = () => {
     const mod = new ModalW1 (this.app);
     mod.plugin = this;
     mod.open();
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
      callback: this.openModal,
    });
    

//    this.app.workspace.on(
//     "active-leaf-change",
//         (leaf: WorkspaceLeaf ) => {
//
//         });
//
this.app.workspace.on('file-menu', this.fileMenuCallbackFunc);


    this.app.workspace.on(
      "editor-drop",
       (evt: DragEvent, editor: Editor, info: MarkdownView ) => 
       {
         this.onDropFunc(evt, editor, info);        
       });




    this.app.vault.on('create', (file: TFile) => 
    {
       this.onCreateFunc(file);        
    });




    this.app.workspace.on(

      "editor-paste",
        ( evt: ClipboardEvent, editor: Editor, info: MarkdownView) => {
        this.onPasteFunc(evt, editor, info);

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

  enqueueActivePage(activeFile: TFile) {
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

  async onunload() {
         this.app.workspace.off("editor-drop", null);
         this.app.workspace.off("editor-paste", null);
//         this.app.vault.off("create",  null);
         logError(APP_TITLE+" unloaded.");
  }

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
      return;
    } catch (e) {
      logError(e);
      return;
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

                          if (this.plugin.settings.saveAttE === "obsFolder" ||
                              this.plugin.settings.saveAttE === "nextToNote" ){
                              el.hide();
                          }
                          else{
                              el.show();
                          }
                     }
                });
   }

  display(): void {
    let { containerEl } = this;
   


    containerEl.empty();


    containerEl.createEl("h2", { text: APP_TITLE});

    const donheader = containerEl.createEl("div");
    donheader.createEl("a", { text: "Support the project! "  , href:"https://www.buymeacoffee.com/sergeikorneev", cls: "donheader_txt" });
    donheader.createEl("a", { text: " GitHub"  , href:"https://github.com/Sergei-Korneev/obsidian-local-images-plus", cls: "donheader_txt" });

    new Setting(containerEl)
      .setName("Automatic processing")
      .setDesc("Process notes on create/copy/paste.")

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
      .setName("Automatic processing interval")
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
      .setName("Process all new files")
      .setDesc("Process all new created/cloud-synced files with corresponding extensions.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.processCreated)
          .onChange(async (value) => {
            this.plugin.settings.processCreated = value;
            await this.plugin.saveSettings();
          })
      );
      

    new Setting(containerEl)
      .setName("Intercept clipboard events")
      .setDesc("Plugin will also process drug&drop, copy/paste events (for files and screenshots).")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.intClip)
          .onChange(async (value) => {
            this.plugin.settings.intClip = value;
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
      .setName("Preserve link captions")
      .setDesc("Add media links captions to converted tags.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.useCaptions)
          .onChange(async (value) => {
            this.plugin.settings.useCaptions = value;
            await this.plugin.saveSettings();
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
      .setName("Add original filename or 'Open file' tag")
      .setDesc("Add [[original filename]] or [original filename](link to attachement) after replaced tag (only for file:// protocol or dropped/pasted files ).")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.addNameOfFile)
          .onChange(async (value) => {
            this.plugin.settings.addNameOfFile = value;
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
      .setName("How to write paths in tags")
      .setDesc("Select whether to write full paths in tags or not.")
      .addDropdown((text) => 
        text
                    .addOption("fullDirPath", "Full path")
                    .addOption("onlyRelative", "Relative to note")
                    .addOption("baseFileName", "Only filename")
                    .setValue(this.plugin.settings.pathInTags)
                    .onChange(async (value) => {
                        this.plugin.settings.pathInTags = value;
                    await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Folder to save new attachements")
      .setDesc("Select where all new attachements will be saved.\nYou can use templates e.g. _resouces/${date}/${notename}")
      .addDropdown((text) => 
        text
                    .addOption("obsFolder", "Copy Obsidian settings")
                    .addOption("inFolderBelow", "In the root folder specified below")
                    .addOption("nextToNoteS", "Next to note in folder specified below")
                    .setValue(this.plugin.settings.saveAttE)

          .onChange(async (value) => {
              this.plugin.settings.saveAttE= value;
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
          .setValue(this.plugin.settings.mediaRootDir)
          .onChange(async (value) => {

          if (value.match(/(\)|\(|\"|\'|\#|\]|\[|\:|\>|\<|\*|\|)/g) !== null )  {
            this.plugin.displayError(
              "Unsafe folder name! Some chars are forbidden in some filesystems."
            );
            return;
          }
            this.plugin.settings.mediaRootDir = value;
          await this.plugin.saveSettings();
        })



      );
                 this.displSw(containerEl);
  }
}
