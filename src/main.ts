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
  TFolder,
} from "obsidian"


import safeRegex from "safe-regex"

import {
  imageTagProcessor,
  getMDir,
  getRDir,
} from "./contentProcessor"

import {
  replaceAsync,
  cFileName,
  md5Sig,
  trimAny,
  logError,
  showBalloon,
  displayError,
  encObsURI,
  pathJoin
} from "./utils"

import {
  APP_TITLE,
  ISettings,
  DEFAULT_SETTINGS,
  MD_SEARCH_PATTERN,
  NOTICE_TIMEOUT,
  TIMEOUT_LIKE_INFINITY
} from "./config"

import { UniqueQueue } from "./uniqueQueue"
import path from "path"
import { ModalW1 } from "./modal"
//import { count, log } from "console"

export default class LocalImagesPlugin extends Plugin {
  settings: ISettings
  modifiedQueue = new UniqueQueue<TFile>()
  intervalId = 0
  newfProcInt: number
  newfCreated: Array<string> = []
  noteModified: Array<TFile> = []
  newfMoveReq: boolean = true
  newfCreatedByDownloader: Array<string> = []



  private async processPage(file: TFile, defaultdir: boolean = false): Promise<any> {

    if (file == null) {
      showBalloon(`Empty note!`, this.settings.showNotifications)
      return null
    }

    const content = await this.app.vault.cachedRead(file);
    const fixedContent = await replaceAsync(
      content,
      MD_SEARCH_PATTERN,
      imageTagProcessor(this,
        file,
        this.settings,
        defaultdir
      )
    )





    if (content != fixedContent[0] && fixedContent[1] === false) {
      this.modifiedQueue.remove(file)
      await this.app.vault.modify(file, fixedContent[0])

      fixedContent[2].forEach(element => {
        this.newfCreatedByDownloader.push(element)
      })

      showBalloon(`Attachements for "${file.path}" were processed.`, this.settings.showNotifications)

    }

    else if (content != fixedContent[0] && fixedContent[1] === true) {

      this.modifiedQueue.remove(file)
      await this.app.vault.modify(file, fixedContent[0])

      fixedContent[2].forEach(element => {
        this.newfCreatedByDownloader.push(element)
      })

      showBalloon(`WARNING!\r\nAttachements for "${file.path}" were processed, but some attachements were not downloaded/replaced...`, this.settings.showNotifications)
    }
    else {
      if (this.settings.showNotifications) {
        showBalloon(`Page "${file.path}" has been processed, but nothing was changed.`, this.settings.showNotifications)
      }
    }
  }

  // using arrow syntax for callbacks to correctly pass this context

  processActivePage = (defaultdir: boolean = false) => async () => {
    logError("processactive")
    try {
      const activeFile = app.workspace.activeEditor.file
      await this.processPage(activeFile, defaultdir)
    } catch (e) {
      showBalloon(`Please select a note or click inside selected note in canvas.`, this.settings.showNotifications)
      return
    }

  }

  processAllPages = async () => {
    const files = this.app.vault.getMarkdownFiles()


    const includeRegex = new RegExp(this.settings.include, "i")

    const pagesCount = files.length

    const notice = this.settings.showNotifications
      ? new Notice(
        APP_TITLE + `\nLocal Images Plus \nStart processing. Total ${pagesCount} pages. `,
        TIMEOUT_LIKE_INFINITY
      )
      : null

    for (const [index, file] of files.entries()) {
      if (file.path.match(includeRegex)) {
        if (notice) {
          //setMessage() is undeclared but factically existing, so ignore the TS error  //@ts-expect-error
          notice.setMessage(
            APP_TITLE + `\nLocal Images Plus: Processing \n"${file.path}" \nPage ${index} of ${pagesCount}`
          )
        }
        await this.processPage(file)
      }
    }
    if (notice) {
      // dum @ts-expect-error
      notice.setMessage(APP_TITLE + `\nLocal Images Plus: ${pagesCount} pages were processed.`)

      setTimeout(() => {
        notice.hide()
      }, NOTICE_TIMEOUT)
    }
  }




  private async onPasteFunc(evt: ClipboardEvent = undefined, editor: Editor = undefined, info: MarkdownView = undefined) {

    if (evt === undefined) { return }

    if (!this.settings.realTimeUpdate) { return }

    try {
      const activeFile = app.workspace.activeEditor.file
      const fItems = evt.clipboardData.files
      const tItems = evt.clipboardData.items

      for (const key in tItems) {

        // Check if it was a text/html
        if (tItems[key].kind == "string") {

          if (this.settings.realTimeUpdate) {
            const cont = htmlToMarkdown(evt.clipboardData.getData("text/html")) +
              htmlToMarkdown(evt.clipboardData.getData("text"))
            for (const reg_p of MD_SEARCH_PATTERN) {
              if (reg_p.test(cont)) {

                showBalloon("Media links were found, processing...", this.settings.showNotifications)

                this.enqueueActivePage(activeFile)
                this.setupQueueInterval()
                break
              }
            }
          }
          return
        }

      }




    } catch (e) {
      showBalloon(`Please select a note or click inside selected note in canvas.`, this.settings.showNotifications)
      return
    }



  }



  // private fileMenuCallbackFunc = (
  //   menu: Menu,
  // ) => {
  //   menu.addSeparator()
  //   menu.addItem((item) => {
  //     item.setTitle("Download media files (plugin folder)")
  //       .setIcon('link')
  //       .onClick(() => {
  //         this.processActivePage(false)()
  //       })
  //   })
  //   menu.addSeparator()
  // }



  private openModal = () => {
    const mod = new ModalW1(this.app)
    mod.plugin = this
    mod.open()
  }


  async onload() {

    await this.loadSettings()




    this.addCommand({
      id: "download-images",
      name: "Download all media files (Plugin folder)",
      callback: this.processActivePage(false),
    })


    this.addCommand({
      id: "download-images-def",
      name: "Download all media files (Obsidian folder)",
      callback: this.processActivePage(true),
    })

    if (!this.settings.disAddCom) {

      this.addRibbonIcon("dice", APP_TITLE + "\r\nDownload media files", () => {
        this.processActivePage(false)()
      });

      this.addCommand({
        id: "set-title-as-name",
        name: "Set first # header as a note name.",
        callback: this.setTitleAsName,
      })

      this.addCommand({
        id: "download-images-all",
        name: "Download media files for all your notes",
        callback: this.openModal,
      })

      this.addCommand({
        id: "convert-selection-to-URI",
        name: "Convert selection to URI",
        callback: this.convertSelToURI,
      })
    }
    Plugin

    //    this.app.workspace.on(
    //   "active-leaf-change",
    //     (leaf: WorkspaceLeaf ) => {

    //logError("change lleaf")


    //   })

    // this.app.workspace.on(
    //   'file-menu',
    //   this.fileMenuCallbackFunc
    // )


    // this.app.workspace.on(
    //   "editor-drop",
    //   (evt: DragEvent, editor: Editor, info: MarkdownView) => {
    //     this.onDropFunc(evt, editor, info)
    //   })



    // Some file has been created

    this.app.vault.on('create', async (file: TFile) => {
      logError("New file created: ")
      logError(file.path)

      this.onMdCreateFunc(file)
      this.onFCreateFunc(file)

    })


    // Some file has been deleted

    this.app.vault.on('delete', async (file: TFile) => {
      const includeRegex = new RegExp(this.settings.include, "i")
      if (!file ||
        !(file instanceof TFile) ||
        !(file.path.match(includeRegex)) ||
        !this.settings.removeMediaFolder ||
        this.settings.saveAttE != "nextToNoteS") {
        return
      }


      let rootdir = this.settings.mediaRootDir
      const useSysTrash = (this.app.vault.getConfig("trashOption") === "system")
      logError(useSysTrash)
      if (this.settings.saveAttE !== "obsFolder" &&
        path.basename(rootdir).includes("${notename}") &&
        !rootdir.includes("${date}")) {

        rootdir = rootdir.replace("${notename}", file.basename)

        if (this.settings.saveAttE == "nextToNoteS") {
          rootdir = pathJoin([path.dirname(file?.path || ""), rootdir])
        }

        try {
          if (this.app.vault.getAbstractFileByPath(rootdir) instanceof TFolder) {
            this.app.vault.trash(app.vault.getAbstractFileByPath(rootdir), useSysTrash)
            showBalloon("Attachment folder " + rootdir + " was moved to trash can.", this.settings.showNotifications)
          }
        } catch (e) {
          logError(e)
          return
        };
      }
    })


    this.app.vault.on('rename', async (file: TFile, oldPath: string) => {
      const includeRegex = new RegExp(this.settings.include, "i")
      if (!file ||
        !(file instanceof TFile) ||
        !(file.path.match(includeRegex)) ||
        !this.settings.removeMediaFolder ||
        this.settings.saveAttE != "nextToNoteS") {
        return
      }

      let oldRootdir = this.settings.mediaRootDir

      if (this.settings.saveAttE != "obsFolder" &&
        path.basename(oldRootdir).includes("${notename}") &&
        !oldRootdir.includes("${date}")) {

        oldRootdir = oldRootdir.replace("${notename}", path.parse(oldPath)?.name)
        let newRootDir = oldRootdir.replace(path.parse(oldPath)?.name, path.parse(file.path)?.name)
        let newRootDir_ = newRootDir
        let oldRootdir_ = oldRootdir


        // if (this.settings.saveAttE == "nextToNoteS") {
        oldRootdir_ = pathJoin([(path.dirname(oldPath) || ""), oldRootdir])
        newRootDir_ = pathJoin([(path.dirname(file.path) || ""), newRootDir])
        // }

        try {
          if (this.app.vault.getAbstractFileByPath(oldRootdir_) instanceof TFolder) {
            await this.ensureFolderExists(path.dirname(newRootDir_))
            //await this.app.fileManager.renameFile(app.vault.getAbstractFileByPath(oldRootdir),newRootDir)
            await this.app.vault.adapter.rename(oldRootdir_, newRootDir_)
          }
        } catch (e) {
          showBalloon("Cannot move attachment folder: \r\n" + e, this.settings.showNotifications)
          logError(e)
          return
        };
        let content = await this.app.vault.cachedRead(file)
        content = content
           .replaceAll("](" + encodeURI(oldRootdir), "](" + encodeURI(newRootDir))
          //.replaceAll("](" + encodeURI(oldRootdir_), "](" + encodeURI(newRootDir_))
          .replaceAll("[" + oldRootdir, "[" + newRootDir)
          //.replaceAll("[" + oldRootdir_, "[" + newRootDir_);
        this.app.vault.modify(file, content)
        showBalloon("Attachment folder was renamed to " + newRootDir_, this.settings.showNotifications)
      }
    })



    // Some file has been modified

    this.app.vault.on('modify', async (file: TFile) => {
      if (!this.newfMoveReq)
        return
      logError("File modified: \r\n")
      logError(file.path + "\r\n", false)

      const includeRegex = new RegExp(this.settings.include, "i")
      if (!file ||
        !(file instanceof TFile) ||
        !(file.path.match(includeRegex))) {
        return
      } else {
        if (this.settings.processAll) {
          if (!this.noteModified.includes(file)) {
            this.noteModified.push(file)
          }
          this.setupNewMdFilesProcInterval()
        }


      }

    })




    this.app.workspace.on(

      "editor-paste",
      (evt: ClipboardEvent, editor: Editor, info: MarkdownView) => {
        this.onPasteFunc(evt, editor, info)

      }
    )

    this.setupQueueInterval()
    this.addSettingTab(new SettingTab(this.app, this))

  }

  setupQueueInterval() {
    if (this.intervalId) {
      const intervalId = this.intervalId
      this.intervalId = 0
      window.clearInterval(intervalId)
    }
    if (
      this.settings.realTimeUpdate &&
      this.settings.realTimeUpdateInterval > 0
    ) {
      this.intervalId = window.setInterval(
        this.processModifiedQueue,
        this.settings.realTimeUpdateInterval * 1000
      )
      this.registerInterval(this.intervalId)
    }
  }





  private async onMdCreateFunc(file: TFile) {

    const includeRegex = new RegExp(this.settings.include, "i")

    if (!file ||
      !(file instanceof TFile) ||
      !(this.settings.processCreated) ||
      !(file.path.match(includeRegex)))
      return


    const timeGapMs = Math.abs(Date.now() - file.stat.ctime)

    if (timeGapMs > 1000)
      return

    logError("func onMdCreateFunc: ")
    logError(file.path, false)

    const cont = await this.app.vault.cachedRead(file)
    for (const reg_p of MD_SEARCH_PATTERN) {
      if (reg_p.test(cont)) {
        //    this.processPage(file)

        this.enqueueActivePage(file)
        this.setupQueueInterval()
        this.setupNewMdFilesProcInterval()
        break
      }
    }
  }

  private async onFCreateFunc(file: TFile) {

    const includeRegex = new RegExp(this.settings.include, "i")
    if (!file ||
      !(file instanceof TFile) ||
      file.path.match(includeRegex) ||
      !(this.settings.processCreated))
      return

    if (!file.stat.ctime)
      return

    const timeGapMs = Math.abs(Date.now() - file.stat.ctime)

    if (timeGapMs > 1000)
      return

    this.newfCreated.push(file.path)
    this.newfMoveReq = true
    this.setupNewMdFilesProcInterval()

  }





  private processMdFilesOnTimer = async () => {

    logError("func processMdFilesOnTimer:\r\n")
    logError(this.noteModified, true)

    window.clearInterval(this.newfProcInt)
    this.newfProcInt = 0
    this.newfMoveReq = false
    let itemcount = 0
    const useMdLinks = this.app.vault.getConfig("useMarkdownLinks")



    for (let note of this.noteModified) {

      const metaCache = this.app.metadataCache.getFileCache(note)
      let filedata = await this.app.vault.cachedRead(note)
      const mdir = await getMDir(this.app, note, this.settings)
      const obsmdir = await getMDir(this.app, note, this.settings, true)
      let embeds = metaCache?.embeds



      if (embeds) {
        await this.ensureFolderExists(mdir)


        for (let el of embeds) {


          let oldpath = pathJoin([obsmdir, path.basename(el.link)])
          let newpath = pathJoin([mdir, cFileName(path.basename(el.link))])
          let newlink: Array<string> = await getRDir(note, this.settings, newpath)
          let oldtag = el["original"];


          if (this.newfCreated.includes(oldpath) &&
            !this.newfCreatedByDownloader.includes(oldtag)) {

            let oldFileData: string | null;
            let newFileData: string | null;

            let oldfileA = this.app.vault.getAbstractFileByPath(oldpath)


            if (this.settings.useMD5ForNewAtt && oldfileA !== null) {
              oldFileData = md5Sig(await this.app.vault.adapter.readBinary(oldfileA.path));
              newpath = pathJoin([mdir, oldFileData + path.extname(el.link)])
              newlink = await getRDir(note, this.settings, newpath)
            }

            let newfileA = this.app.vault.getAbstractFileByPath(newpath)

            if (await this.app.vault.adapter.exists(newpath)) {
              if (oldfileA !== null && newfileA !== null) {

                newFileData = md5Sig(await this.app.vault.adapter.readBinary(newfileA.path));
                oldFileData = md5Sig(await this.app.vault.adapter.readBinary(oldfileA.path));


                if (newFileData === oldFileData) {

                  logError("deleting " + oldpath)
                  await this.app.vault.delete(oldfileA)

                }

                else {

                  logError("renaming existing " + oldpath)
                  let inc = 1
                  while (await this.app.vault.adapter.exists(newpath)) {
                    newpath = pathJoin([mdir, `(${inc}) ` + cFileName(path.basename(el.link))])
                    inc++
                  }
                  newlink = await getRDir(note, this.settings, newpath)
                  await this.app.vault.rename(oldfileA, newpath)
                }


              }

            } else {
              logError(`renaming  ${oldpath}  to  ${newpath}`)
              if (oldfileA !== null) {
                await this.app.vault.rename(oldfileA, newpath)
              }
            }


            let addName = "";
            if (this.settings.addNameOfFile) {
              if (useMdLinks) {
                addName = `[Open: ${el.link}](${newlink[1]})\r\n`
              } else {
                addName = `[[${newlink[0]}|Open: ${el.link}]]\r\n`
              }

            }


            let newtag = addName + oldtag.replace(el.link, newlink[0])

            if (useMdLinks) {
              newtag = addName + oldtag.replace(encObsURI(el.link), newlink[1])
            }


            filedata = filedata.replaceAll(oldtag, newtag)
            itemcount++
          }
        }


      }
      if (itemcount > 0) {
        await this.app.vault.modify(note, filedata)
        showBalloon(itemcount + " attachements for note " + note.path + " were processed.", this.settings.showNotifications)
        itemcount = 0
      }
    }

    this.newfCreated = []
    this.newfCreatedByDownloader = []
    this.noteModified = []
    this.newfMoveReq = false
    window.clearInterval(this.newfProcInt)
    this.newfProcInt = 0

  }





  private setTitleAsName = async () => {
    try {
      const noteFile = app.workspace.activeEditor.file
      const fileData = await this.app.vault.cachedRead(noteFile)
      const title = fileData.match(/^#{1,6} .+?($|\n)/gm)
      var ind = 0
      if (title !== null) {
        const newName = cFileName(trimAny(title[0].toString(), ["#", " "])).slice(0, 200)
        var fullPath = pathJoin([noteFile.parent.path, newName + ".md"])
        var fExist = await this.app.vault.exists(fullPath)
        if (trimAny(noteFile.path, ["\\", "/"]) != trimAny(fullPath, ["\\", "/"])) {
          while (fExist) {
            ind++
            var fullPath = pathJoin([noteFile.parent.path, newName + " (" + ind + ")" + ".md"])
            var fExist = await this.app.vault.exists(fullPath)
          }
          await this.app.vault.rename(noteFile, fullPath)

          showBalloon(`The note was renamed to ` + fullPath, this.settings.showNotifications)

        }
      }

    } catch (e) {
      showBalloon(`Cannot rename. Please select a note or click inside selected note in canvas.`, this.settings.showNotifications)
      return
    }
  }





  setupNewMdFilesProcInterval() {
    logError("func setupNewFilesProcInterval: \r\n")
    window.clearInterval(this.newfProcInt)
    this.newfProcInt = 0
    this.newfProcInt = window.setInterval(
      this.processMdFilesOnTimer,
      this.settings.realTimeUpdateInterval * 1000
    )
    this.registerInterval(this.newfProcInt)
  }

  private convertSelToURI = async () => {
    this.app.workspace.activeEditor.editor.replaceSelection(encObsURI(await this.app.workspace.activeEditor.getSelection()))
  }




  processModifiedQueue = async () => {
    const iteration = this.modifiedQueue.iterationQueue();
    for (const page of iteration) {
      this.processPage(page, false);
    }
  };

  enqueueActivePage(activeFile: TFile) {
    this.modifiedQueue.push(
      activeFile,
      1//this.settings.realTim3AttemptsToProcess
    )
  }




  // ------------  Load / Save settings -----------------



  async onunload() {
    this.app.workspace.off("editor-drop", null)
    this.app.workspace.off("editor-paste", null)
    this.app.workspace.off('file-menu', null)
    //         this.app.vault.off("create",  null)
    logError(" unloaded.")
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
    this.setupQueueInterval()
  }

  async saveSettings() {
    try {
      await this.saveData(this.settings)
    } catch (error) {
      displayError(error)
    }
  }

  async ensureFolderExists(folderPath: string) {
    try {
      await this.app.vault.createFolder(folderPath)
      return
    } catch (e) {
      logError(e)
      return
    }
  }
}


// ------------------ Settings tab ----------------------


class SettingTab extends PluginSettingTab {
  plugin: LocalImagesPlugin

  constructor(app: App, plugin: LocalImagesPlugin) {
    super(app, plugin)
    this.plugin = plugin
  }

  displSw(cont: any): void {
    cont.findAll(".setting-item").forEach((el: any) => {
      if (el.getAttr("class").includes("media_folder_set")) {

        if (this.plugin.settings.saveAttE === "obsFolder" ||
          this.plugin.settings.saveAttE === "nextToNote") {
          el.hide()
        }
        else {
          el.show()
        }
      }
    })
  }

  display(): void {
    let { containerEl } = this



    containerEl.empty()


    containerEl.createEl("h1", { text: APP_TITLE })

    const donheader = containerEl.createEl("div")
    donheader.createEl("a", { text: "Support the project! ", href: "https://www.buymeacoffee.com/sergeikorneev", cls: "donheader_txt" })

    containerEl.createEl("h3", { text: "Interface settings" })

    new Setting(containerEl)
      .setName("Show notifications")
      .setDesc("Show notifications when pages were processed.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showNotifications)
          .onChange(async (value) => {
            this.plugin.settings.showNotifications = value
            await this.plugin.saveSettings()
          })
      )

    new Setting(containerEl)
      .setName("Disable additional commands")
      .setDesc("Do not show additional commands in command palette. Reload the plugin in settings to take effect (turn off/on).")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.disAddCom)
          .onChange(async (value) => {
            this.plugin.settings.disAddCom = value
            await this.plugin.saveSettings()
          })
      )

    containerEl.createEl("h3", { text: "Processing settings" })



    new Setting(containerEl)
      .setName("Automatic processing")
      .setDesc("Process notes on create/copy/paste.")

      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.realTimeUpdate)
          .onChange(async (value) => {
            this.plugin.settings.realTimeUpdate = value
            await this.plugin.saveSettings()
            this.plugin.setupQueueInterval()
          })
      )

    new Setting(containerEl)
      .setName("Automatic processing interval")
      .setDesc("Interval in seconds for processing update. It takes some time to reveal changed content of a note to plugins.")
      .addText((text) =>
        text
          .setValue(String(this.plugin.settings.realTimeUpdateInterval))
          .onChange(async (value: string) => {

            let numberValue = Number(value)
            if (
              isNaN(numberValue) ||
              !Number.isInteger(numberValue) ||
              numberValue <= 5 ||
              numberValue > 3600
            ) {


              displayError(

                "The value should be a positive integer number between 5 and 3600!"
              )
              return
            }

            if (numberValue < 5) {
              numberValue = 5
            }
            this.plugin.settings.realTimeUpdateInterval = numberValue
            await this.plugin.saveSettings()
            this.plugin.setupQueueInterval()
          })
      )



    new Setting(containerEl)
      .setName("Number of retries for every single attachment")
      .setDesc("If an error occurs during downloading (network etc.) try to re-download several times.")
      .addText((text) =>
        text
          .setValue(String(this.plugin.settings.tryCount))
          .onChange(async (value: string) => {

            let numberValue = Number(value)
            if (
              isNaN(numberValue) ||
              !Number.isInteger(numberValue) ||
              numberValue < 1 ||
              numberValue > 6
            ) {
              displayError(
                "The value should be a positive integer number between 1 and 6!"
              )
              return
            }
            this.plugin.settings.tryCount = numberValue
            await this.plugin.saveSettings()
          })
      )

    new Setting(containerEl)
      .setName("Process all new markdown files")
      .setDesc("Process all new created/cloud-synced files with corresponding extensions.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.processCreated)
          .onChange(async (value) => {
            this.plugin.settings.processCreated = value
            await this.plugin.saveSettings()
          })
      )


    new Setting(containerEl)
      .setName("Process all new attachements")
      .setDesc("The plugin will also move all attachements from obsidian default folder to plugin folder.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.processAll)
          .onChange(async (value) => {
            this.plugin.settings.processAll = value
            await this.plugin.saveSettings()
          })
      )

    new Setting(containerEl)
      .setName("Use MD5 for new attachements")
      .setDesc("The plugin will use MD5 when renaming all new attachements.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.useMD5ForNewAtt)
          .onChange(async (value) => {
            this.plugin.settings.useMD5ForNewAtt = value
            await this.plugin.saveSettings()
          })
      )

    new Setting(containerEl)
      .setName("Download unknown filetypes")
      .setDesc("Download unknown filetypes and save them with .unknown extension.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.downUnknown)
          .onChange(async (value) => {
            this.plugin.settings.downUnknown = value
            await this.plugin.saveSettings()
          })
      )

    new Setting(containerEl)
      .setName("File size lower limit in Kb")
      .setDesc("Do not download files with size less than this value. Set 0 for no limit.")
      .addText((text) =>
        text
          .setValue(String(this.plugin.settings.filesizeLimit))
          .onChange(async (value: string) => {

            let numberValue = Number(value)
            if (
              isNaN(numberValue) ||
              !Number.isInteger(numberValue) ||
              numberValue < 0
            ) {


              displayError(

                "The value should be a positive integer!"
              )
              return
            }

            if (numberValue < 0) {
              numberValue = 0
            }
            this.plugin.settings.filesizeLimit = numberValue
            await this.plugin.saveSettings()
          })
      )

    new Setting(containerEl)
      .setName("Exclusions")
      .setDesc("The plugin will not download attachements with these extensions.")
      .addText((text) =>
        text
          .setValue(this.plugin.settings.ignoredExt)
          .onChange(async (value) => {
            this.plugin.settings.ignoredExt = value
            await this.plugin.saveSettings()
          })
      )



    containerEl.createEl("h3", { text: "Note settings" })

    new Setting(containerEl)
      .setName("Preserve link captions")
      .setDesc("Add media links captions to converted tags.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.useCaptions)
          .onChange(async (value) => {
            this.plugin.settings.useCaptions = value
            await this.plugin.saveSettings()
          })
      )


    new Setting(containerEl)
      .setName("Add original filename or 'Open file' tag")
      .setDesc("Add [[original filename]] or [original filename](link to attachement) after replaced tag (only for file:// protocol or dropped/pasted files ).")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.addNameOfFile)
          .onChange(async (value) => {
            this.plugin.settings.addNameOfFile = value
            await this.plugin.saveSettings()
          })
      )



    new Setting(containerEl)
      .setName("Include")
      .setDesc(
        "Include only files matching this regex pattern when running on all notes."
      )
      .addText((text) =>
        text.setValue(this.plugin.settings.include).onChange(async (value) => {
          if (!safeRegex(value)) {
            displayError(
              "Unsafe regex! https://www.npmjs.com/package/safe-regex"
            )
            return
          }
          this.plugin.settings.include = value
          await this.plugin.saveSettings()
        })
      )


    containerEl.createEl("h3", { text: "Media folder settings" })

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
            this.plugin.settings.pathInTags = value
            await this.plugin.saveSettings()
          })
      )

    new Setting(containerEl)
      .setName("Folder to save new attachements")
      .setDesc("Select where all new attachements will be saved.\nYou can use templates e.g. _resouces/${date}/${notename}")
      .addDropdown((text) =>
        text
          .addOption("obsFolder", "Copy Obsidian settings")
          .addOption("inFolderBelow", "In the root folder specified below")
          .addOption("nextToNoteS", "Next to note in the folder specified below")
          .setValue(this.plugin.settings.saveAttE)

          .onChange(async (value) => {
            this.plugin.settings.saveAttE = value
            this.displSw(containerEl)

            await this.plugin.saveSettings()
          })
      )

    new Setting(containerEl)
      .setName("Move/delete/rename media folder")
      .setDesc("Rename or move this folder to the obsidian or system garbage can when the associated note is deleted/renamed/moved. \
                This setting takes effect only if the path contains ${notename} template at the end\
                and the option 'Next to note in the folder specified below' selected.\
                Use this setting at your own risk.")
      .setClass("media_folder_set")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.removeMediaFolder)
          .onChange(async (value) => {
            this.plugin.settings.removeMediaFolder = value
            await this.plugin.saveSettings()
          })
      )


    new Setting(containerEl)
      .setName("Media folder")
      .setDesc("Folder to keep all downloaded media files.")
      .setClass("media_folder_set")
      .addText((text) =>
        text
          .setValue(this.plugin.settings.mediaRootDir)
          .onChange(async (value) => {

            if (value.match(/(\)|\(|\"|\'|\#|\]|\[|\:|\>|\<|\*|\|)/g) !== null) {
              displayError(
                "Unsafe folder name! Some chars are forbidden in some filesystems."
              )
              return
            }
            this.plugin.settings.mediaRootDir = value
            await this.plugin.saveSettings()
          })



      )
    this.displSw(containerEl)
  }
}
