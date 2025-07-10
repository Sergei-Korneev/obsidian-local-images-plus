import {
  Notice,
  Plugin,
  TFile,
  Editor,
  htmlToMarkdown,
  MarkdownView,
  TFolder,
} from "obsidian"

import SettingTab from "./settingstab"

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
  pathJoin,
  blobToJpegArrayBuffer,
  getFileExt,
  readFromDiskB
} from "./utils"

import {
  APP_TITLE,
  ISettings,
  DEFAULT_SETTINGS,
  MD_SEARCH_PATTERN,
  NOTICE_TIMEOUT,
  TIMEOUT_LIKE_INFINITY,

} from "./config"

import { UniqueQueue } from "./uniqueQueue"
import path from "path"
import { ModalW1 } from "./modal"
const fs = require('fs').promises;






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



  async onload() {

    await this.loadSettings()

    this.addCommand({
      id: "download-images",
      name: "Localize attachments for the current note (plugin folder)",
      callback: this.processActivePage(false),
    })


    this.addCommand({
      id: "download-images-def",
      name: "Localize attachments for the current note (Obsidian folder)",
      callback: this.processActivePage(true),
    })

    if (!this.settings.disAddCom) {

      this.addRibbonIcon("dice", APP_TITLE + "\r\nLocalize attachments (plugin folder)", () => {
        this.processActivePage(false)()
      });

      this.addCommand({
        id: "set-title-as-name",
        name: "Set the first found # header as a note name.",
        callback: this.setTitleAsName,
      })

      this.addCommand({
        id: "download-images-all",
        name: "Localize attachments for all your notes (plugin folder)",
        callback: this.openProcessAllModal,
      })

      this.addCommand({
        id: "convert-selection-to-URI",
        name: "Convert selection to URI",
        callback: this.convertSelToURI,
      })

      this.addCommand({
        id: "convert-selection-to-md",
        name: "Convert selection from html to markdown",
        callback: this.convertSelToMD,
      })

      this.addCommand({
        id: "remove-orphans-from-obsidian-folder",
        name: "Remove all orphaned attachments (Obsidian folder)",
        callback: () => { this.removeOrphans("obsidian")() },
      })

      this.addCommand({
        id: "remove-orphans-from-plugin-folder",
        name: "Remove all orphaned attachments (Plugin folder)",
        callback: () => { this.removeOrphans("plugin")() },
      })
    }





    // Some file has been created

    this.app.vault.on('create', async (file: TFile) => {
      
      logError("New file created: " + file.path)

      if (this.ExemplaryOfMD(file.path)){
        this.onMdCreateFunc(file)
      } else{
        this.onFCreateFunc(file)
      }

    })


    // Some file has been deleted

    this.app.vault.on('delete', async (file: TFile) => {
 
      if (!file ||
        !(file instanceof TFile) ||
        !(this.ExemplaryOfMD(file.path)) ||
        !this.settings.removeMediaFolder ||
        this.settings.saveAttE != "nextToNoteS") {
        return
      }


      let rootdir = this.settings.mediaRootDir
      const useSysTrash = (this.app.vault.getConfig("trashOption") === "system")
    
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
     
      if (!file ||
        !(file instanceof TFile) ||
        !(this.ExemplaryOfMD(file.path)) ||
        !this.settings.removeMediaFolder ||
        this.settings.saveAttE != "nextToNoteS" ||
        this.settings.pathInTags != "onlyRelative") {
        return
      }

      let oldRootdir = this.settings.mediaRootDir

      if (path.basename(oldRootdir).includes("${notename}") &&
        !oldRootdir.includes("${date}")) {

        oldRootdir = oldRootdir.replace("${notename}", path.parse(oldPath)?.name)
        let newRootDir = oldRootdir.replace(path.parse(oldPath)?.name, path.parse(file.path)?.name)
        let newRootDir_ = newRootDir
        let oldRootdir_ = oldRootdir

        oldRootdir_ = pathJoin([(path.dirname(oldPath) || ""), oldRootdir])
        newRootDir_ = pathJoin([(path.dirname(file.path) || ""), newRootDir])


        try {
          if (this.app.vault.getAbstractFileByPath(oldRootdir_) instanceof TFolder) {
            await this.ensureFolderExists(path.dirname(newRootDir_))
            //await this.app.fileManager.renameFile(app.vault.getAbstractFileByPath(oldRootdir),newRootDir)
            await this.app.vault.adapter.rename(oldRootdir_, newRootDir_)
            showBalloon("Attachment folder was renamed to " + newRootDir_, this.settings.showNotifications)
          }
        } catch (e) {
          showBalloon("Cannot move attachment folder: \r\n" + e, this.settings.showNotifications)
          logError(e)
          return
        };
        let content = await this.app.vault.cachedRead(file)
        content = content
          .replaceAll("](" + encodeURI(oldRootdir), "](" + encodeURI(newRootDir))
          .replaceAll("[" + oldRootdir, "[" + newRootDir)
        this.app.vault.modify(file, content)

      }
    })



    // Some file has been modified

    this.app.vault.on('modify', async (file: TFile) => {
      if (!this.newfMoveReq)
        return
      logError("File modified: " + file.path , false)
 
      if (!file ||
        !(file instanceof TFile) ||
        !(this.ExemplaryOfMD(file.path))) {
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


  private getCurrentNote(): TFile | null {
    try {
      const noteFile = app.workspace.activeEditor.file
      return noteFile
    } catch (e) {
      showBalloon("Cannot get current note! ", this.settings.showNotifications)

    }
    return null

  }


  private async processPage(file: TFile, defaultdir: boolean = false): Promise<any> {
    
 
    if (file == null ) {return null}

    const content = await this.app.vault.cachedRead(file)
    if (content.length == 0) {return null}
      

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

      fixedContent[2].forEach((element: string) => {
        this.newfCreatedByDownloader.push(element)
      })

      showBalloon(`Attachments for "${file.path}" were processed.`, this.settings.showNotifications)

    }

    else if (content != fixedContent[0] && fixedContent[1] === true) {

      this.modifiedQueue.remove(file)
      await this.app.vault.modify(file, fixedContent[0])

      fixedContent[2].forEach((element: string) => {
        this.newfCreatedByDownloader.push(element)
      })

      showBalloon(`WARNING!\r\nAttachments for "${file.path}" were processed, but some attachments were not downloaded/replaced...`, this.settings.showNotifications)
    }
    else {
      if (this.settings.showNotifications) {
        showBalloon(`Page "${file.path}" has been processed, but nothing was changed.`, this.settings.showNotifications)
      }
    }
  }

  // using arrow syntax for callbacks to correctly pass this context

  processActivePage = (defaultdir: boolean = false) => async () => {
    logError("processActivePage")
    try {
      const activeFile = this.getCurrentNote()
      await this.processPage(activeFile, defaultdir)
    } catch (e) {
      showBalloon(`Please select a note or click inside selected note in canvas.`, this.settings.showNotifications)
      return
    }
  }

  processAllPages = async () => {
    const files = this.app.vault.getMarkdownFiles()
 
    const pagesCount = files.length

    const notice = this.settings.showNotifications

      ? new Notice(
        APP_TITLE + `\nStart processing. Total ${pagesCount} pages. `,
        TIMEOUT_LIKE_INFINITY
      )
      : null

    for (const [index, file] of files.entries()) {
      if (this.ExemplaryOfMD(file.path)) {
        if (notice) {
          //setMessage() is undeclared but factically existing, so ignore the TS error  //@ts-expect-error
          notice.setMessage(
            APP_TITLE + `\nProcessing \n"${file.path}" \nPage ${index} of ${pagesCount}`
          )
        }
        await this.processPage(file)
      }
    }
    if (notice) {
      // dum @ts-expect-error
      notice.setMessage(APP_TITLE + `\n${pagesCount} pages were processed.`)

      setTimeout(() => {
        notice.hide()
      }, NOTICE_TIMEOUT)
    }
  }




  private async onPasteFunc(evt: ClipboardEvent = undefined, editor: Editor = undefined, info: MarkdownView = undefined) {

    if (evt === undefined) { return }

    if (!this.settings.realTimeUpdate) { return }

    try {
      const activeFile = this.getCurrentNote()
      const fItems = evt.clipboardData.files
      const tItems = evt.clipboardData.items
 
      if (fItems.length != 0) { return }
      
      for (const key in tItems) {

        // Check if it was a text/html
        if (tItems[key].kind == "string") {
          
          if (this.settings.realTimeUpdate) {
            
            const cont = htmlToMarkdown(evt.clipboardData.getData("text/html")) +
            
            htmlToMarkdown(evt.clipboardData.getData("text"))
            



            for (const reg_p of MD_SEARCH_PATTERN) {
              if (reg_p.test(cont)) {
                logError("content: " + cont)
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




  private removeOrphans = (type: string = undefined,
    filesToRemove: Array<TFile> = undefined,
    noteFile: TFile = undefined) => async () => {

      const obsmediadir = app.vault.getConfig("attachmentFolderPath")
      const allFiles = this.app.vault.getFiles()
      let oldRootdir = this.settings.mediaRootDir

      if (type == "plugin") {
        let orphanedAttachments = []
        let allAttachmentsLinks = []
        if (this.settings.saveAttE != "nextToNoteS" ||
          !path.basename(oldRootdir).endsWith("${notename}") ||
          oldRootdir.includes("${date}")) {
          showBalloon("This command requires the settings 'Next to note in the folder specified below' and pattern '${notename}' at the end to be enabled, also the path cannot contain ${date} pattern.\nPlease, change settings first!\r\n", this.settings.showNotifications)
          return
        }
         
        if (!noteFile) {
          noteFile = this.getCurrentNote()
          if (!noteFile) {
            showBalloon("Please, select a note or click inside a note in canvas!", this.settings.showNotifications)
            return
          }

        }


        if (this.ExemplaryOfMD(noteFile.path)) {

          oldRootdir = oldRootdir.replace("${notename}", path.parse(noteFile.path)?.name)
          oldRootdir = trimAny(pathJoin([path.parse(noteFile.path)?.dir, oldRootdir]), ["\/"])
          if (! await this.app.vault.exists(oldRootdir)) {
            showBalloon("The attachment folder " + oldRootdir + " does not exist!", this.settings.showNotifications)
            return
          }
          const allAttachments = await this.app.vault.getAbstractFileByPath(oldRootdir)?.children
          const metaCache = this.app.metadataCache.getFileCache(noteFile)
          const embeds = metaCache?.embeds
          const links = metaCache?.links

          if (embeds) {
            for (const embed of embeds) {
              allAttachmentsLinks.push(path.basename(embed.link))
            }
          }
          if (links) {
            for (const link of links) {
              allAttachmentsLinks.push(path.basename(link.link))
            }
          }
          if (allAttachments) {
            for (const attach of allAttachments) {
              if (!allAttachmentsLinks.includes(attach.name) && attach.children == undefined ) {
                logError("orph: " + attach.basename)
                orphanedAttachments.push(attach)
              }
            }
          }


          if (orphanedAttachments.length > 0) {
            const mod = new ModalW1(this.app)
            mod.messg = "Confirm remove " + orphanedAttachments.length + " orphan(s) from '" + oldRootdir + "'\r\n\r\n      "
            mod.plugin = this
            mod.callbackFunc = this.removeOrphans("execremove", orphanedAttachments)
            mod.open()
          } else {
            showBalloon("No orphaned files found!", this.settings.showNotifications)
          }

        }


      }



      if (type == "obsidian") {

        if (obsmediadir.slice(0, 2) == "./" || obsmediadir == "/") {
          showBalloon("This command cannot run on vault's root or on subfolder next to note!\nPlease, change settings first!\r\n", this.settings.showNotifications)
          return
        }

        const allAttachments = this.app.vault.getAbstractFileByPath(obsmediadir)?.children
        let orphanedAttachments = []
        let allAttachmentsLinks = []
        
        
 
        if (allFiles) {

          for (const file of allFiles) {
            
            //Fix for canvas files
            if (file !== null && this.ExemplaryOfCANVAS(file.path)){
             logError(file) 
              
             logError(this.app.metadataCache.getCache(file.path))
              
   
              let canvasData
              try {
                canvasData = JSON.parse(await app.vault.cachedRead(file))
              } catch (e) {
                logError("Parse canvas data error")  
                continue
              }
               
              if (canvasData.nodes && canvasData.nodes.length > 0) {
                for (const node of canvasData.nodes) {
                  
                  logError(node)
                    
                  if (node.type === "file") {
                    
                    logError("file json")
                    
                    allAttachmentsLinks.push(path.basename(node.file))
                    
                  } else if (node.type == "text") {
                    
                    logError("text json")
                   
                    //https://github.com/Fevol/obsidian-typings
                    //Undocumented API may be altered in the future
                    const AllNodeLinks = (await this.app.internalPlugins.plugins.canvas.instance.index.parseText(node.text))?.links;
 
                    logError(AllNodeLinks)
 
                    if (AllNodeLinks === undefined){continue}

                    for (const Nodelink of AllNodeLinks) {
                      allAttachmentsLinks.push(path.basename(Nodelink.link))
                    }
                  }
                }
              }
            
      

            }

          if (file !== null && this.ExemplaryOfMD(file.path)){

    
              const metaCache = this.app.metadataCache.getCache(file.path)
              const embeds = metaCache?.embeds
              const links = metaCache?.links
              logError(embeds)
              logError(links)


              if (embeds) {
                for (const embed of embeds) {
                  allAttachmentsLinks.push(path.basename(embed.link))
                }
              }
              if (links) {
                for (const link of links) {
                  allAttachmentsLinks.push(path.basename(link.link))
                }
              }
            

          }
        }

          for (const attach of allAttachments) {
            if (!allAttachmentsLinks.includes(attach.name) && attach.children == undefined ) {
              logError(allAttachmentsLinks)
              logError(attach.name)
              logError("orph: " + attach.name)
              orphanedAttachments.push(attach)
            }
          }

        }


        logError("Orphaned: ")
        logError(orphanedAttachments, true)
        if (orphanedAttachments.length > 0) {
          const mod = new ModalW1(this.app)
          mod.messg = "Confirm remove " + orphanedAttachments.length + " orphan(s) from '" + obsmediadir + "  '\r\n \
          NOTE: Be careful when running this command on Obsidian attachments folder, since some html-linked files may also be moved.\r\n      "
          mod.plugin = this
          mod.callbackFunc = this.removeOrphans("execremove", orphanedAttachments)
          mod.open()
        } else {
          showBalloon("No orphaned files found!", this.settings.showNotifications)
        }




      }


      if (type == "execremove") {
        const useSysTrash = (this.app.vault.getConfig("trashOption") === "system")
        const remcompl = this.settings.removeOrphansCompl
        let msg = "";

        if (filesToRemove) {

          filesToRemove.forEach((el: TFile) => {

            if (remcompl) {
              msg = "were deleted completely."
              this.app.vault.delete(el, true)
            } else {
              if (useSysTrash) {
                msg = "were moved to the system garbage can."
              } else {
                msg = "were moved to the Obsidian garbage can."
              }
              this.app.vault.trash(el, useSysTrash)
            }

          })
        }

        showBalloon(filesToRemove.length + " file(s) " + msg, this.settings.showNotifications)

      }

    }




  private openProcessAllModal = () => {
    const mod = new ModalW1(this.app)
    mod.messg = "Confirm processing all pages.\r\n "
    mod.plugin = this
    mod.callbackFunc = this.processAllPages
    mod.open()
  }
 



  private async onMdCreateFunc(file: TFile) {

 
    if (!file ||
      !(file instanceof TFile) ||
      !(this.settings.processCreated) ||
      !this.ExemplaryOfMD(file.path)
       )
      return


    const timeGapMs = Math.abs(Date.now() - file.stat.ctime)

    if (timeGapMs > 1000)
      return

    logError("func onMdCreateFunc: " + file.path)
    logError(file,true)
 

    var cont = await this.app.vault.cachedRead(file)
 
    logError(cont)
  
        this.enqueueActivePage(file)
        this.setupQueueInterval()
        this.setupNewMdFilesProcInterval()
 
    
  }

  private async onFCreateFunc(file: TFile) {
 
    if (!file ||
      !(file instanceof TFile) ||
      this.ExemplaryOfMD(file.path)||
      this.ExemplaryOfCANVAS(file.path)||
      !(this.settings.processAll))
      return

    if (!file.stat.ctime)
      return

    const timeGapMs = Math.abs(Date.now() - file.stat.mtime)

    if (timeGapMs > 1000)
      return

    this.newfCreated.push(file.path)
    this.newfMoveReq = true
    this.setupNewMdFilesProcInterval()
    logError("file created  ")
  }


  private ExemplaryOfMD(pat: string){
    const includeRegex = new RegExp(this.settings.includepattern, "i")
    return (pat.match(includeRegex)?.groups?.md != undefined)
  }


  private ExemplaryOfCANVAS(pat: string){
    const includeRegex = new RegExp(this.settings.includepattern, "i")
    return (pat.match(includeRegex)?.groups?.canvas != undefined)
  }

  private processMdFilesOnTimer = async () => {

    const th = this
    function onRet() {
      th.newfCreated = []
      th.newfCreatedByDownloader = []
      th.noteModified = []
      th.newfMoveReq = false
      window.clearInterval(th.newfProcInt)
      th.newfProcInt = 0
    }

    logError("func processMdFilesOnTimer:\r\n")
    logError(this.noteModified, true)

    try {


      window.clearInterval(this.newfProcInt)
      this.newfProcInt = 0
      this.newfMoveReq = false
      let itemcount = 0
      const useMdLinks = this.app.vault.getConfig("useMarkdownLinks")



      for (let note of this.noteModified) {

        const metaCache = this.app.metadataCache.getFileCache(note)
        let filedata = await this.app.vault.cachedRead(note)
        

        let pr = false
        for (const reg_p of MD_SEARCH_PATTERN) {
          if (reg_p.test(filedata)) {
            pr = true
            break
          }
        }

 

        const mdir = await getMDir(this.app, note, this.settings)
        const obsmdir = await getMDir(this.app, note, this.settings, true)
        let embeds = metaCache?.embeds



        if (obsmdir != "" && ! await this.app.vault.adapter.exists(obsmdir)) {
         if ( ! this.settings.DoNotCreateObsFolder){
          this.ensureFolderExists(obsmdir)
          showBalloon("You obsidian media folder set to '" + obsmdir + "', and has been created by the plugin. Please, try again. ", this.settings.showNotifications)
          onRet()
        }
          return
        }



        if (embeds || pr) {


          await this.ensureFolderExists(mdir)

          for (let el of embeds) {

            logError(el)

            let oldpath = pathJoin([obsmdir, path.basename(el.link)])
            let oldtag = el["original"];
            logError(useMdLinks)



            logError(this.newfCreated)
            
            if ((this.newfCreated.indexOf(el.link) != -1 || (obsmdir != "" && (this.newfCreated.includes(oldpath) || this.newfCreated.includes(el.link)))) &&
              !this.newfCreatedByDownloader.includes(oldtag)) {


              if (! await this.app.vault.adapter.exists(oldpath)) {
                logError("Cannot find " + el.link + " skipping...")
                continue
              }


              let newpath = pathJoin([mdir, cFileName(path.basename(el.link))])
              let newlink: Array<string> = await getRDir(note, this.settings, newpath)

              logError(el.link)

              //let newBinData: Buffer | null = null

              let newBinData: ArrayBuffer | null = null
              let newMD5: string | null = null
              const oldBinData = await readFromDiskB(pathJoin([this.app.vault.adapter.basePath, oldpath]), 5000)
              const oldMD5 = md5Sig(oldBinData)
              const fileExt = await getFileExt(oldBinData, oldpath)

              logError("oldbindata: " + oldBinData)
              logError("oldext: " + fileExt)
           
              if (this.settings.PngToJpegLocal && fileExt == "png") {


                let compType = "image/jpg";
                let compExt = ".jpg";

                if (this.settings.ImgCompressionType == "image/webp") {
                   compType = "image/webp";
                   compExt = ".webp";
                }

                logError("Compressing image to ")

                const blob = new Blob([new Uint8Array(await this.app.vault.adapter.readBinary(oldpath))]);
                newBinData = await blobToJpegArrayBuffer(blob, this.settings.JpegQuality*0.01, compType)
                
                newMD5 = md5Sig(newBinData)
                logError(newBinData)
                if (newBinData != null) {

                  if (this.settings.useMD5ForNewAtt) {
                    newpath = pathJoin([mdir, newMD5 + compExt])
                  } else {
                    newpath = pathJoin([mdir, cFileName(path.parse(el.link)?.name + compExt)])
                  }
                  newlink = await getRDir(note, this.settings, newpath)
                }

              } else if (this.settings.useMD5ForNewAtt) {
                newpath = pathJoin([mdir, oldMD5 + path.extname(el.link)])
                newlink = await getRDir(note, this.settings, newpath)

              } else if (!this.settings.useMD5ForNewAtt) {
                newpath = pathJoin([mdir, cFileName(path.basename(el.link))])
                newlink = await getRDir(note, this.settings, newpath)
              }



              if (await this.app.vault.adapter.exists(newpath)) {

                let newFMD5
                if (newBinData != null) {
                  newFMD5 = md5Sig(await this.app.vault.adapter.readBinary(newpath))
                } else {
                  newFMD5 = md5Sig(await readFromDiskB(pathJoin([this.app.vault.adapter.basePath, newpath]), 5000))
                }


                if (newMD5 === newFMD5 || (oldMD5 === newFMD5 && oldpath != newpath)) {

                  logError(path.dirname(oldpath))
                  logError("Deleting duplicate file: " + oldpath)
                  await this.app.vault.adapter.remove(oldpath)

                } else if (oldpath != newpath) {

                  logError("Renaming existing: " + oldpath)
                  let inc = 1
                  while (await this.app.vault.adapter.exists(newpath)) {
                    newpath = pathJoin([mdir, `(${inc}) ` + cFileName(path.basename(el.link))])
                    inc++
                  }

                  newlink = await getRDir(note, this.settings, newpath)
                  await this.app.vault.adapter.rename(oldpath, newpath)
                }

              } else {
                logError(`renaming  ${oldpath}  to  ${newpath}`)
                try {
                  if (newBinData != null) {
                    await this.app.vault.adapter.writeBinary(newpath, newBinData).then(
                    ); {
                      await this.app.vault.adapter.remove(oldpath)
                    }

                  } else {
                    await this.app.vault.adapter.rename(oldpath, newpath)
                  }

                } catch (error) {
                  logError(error)
                }


              }


              let addName = "";
              if (this.settings.addNameOfFile) {
                if (useMdLinks) {
                  addName = `[Open: ${path.basename(el.link)}](${newlink[1]})\r\n`
                } else {
                  addName = `[[${newlink[0]}|Open: ${path.basename(el.link)}]]\r\n`
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
          showBalloon(itemcount + " attachments for note " + note.path + " were processed.", this.settings.showNotifications)
          itemcount = 0
        }
      }
    } catch (e) {
      logError(e)
      onRet()
    }
    onRet()

  }





  private setTitleAsName = async () => {
    try {
      const noteFile = this.getCurrentNote()
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
      showBalloon(`Cannot rename.`, this.settings.showNotifications)
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

  private convertSelToMD = async () => {
    this.app.workspace.activeEditor.editor.replaceSelection(htmlToMarkdown(await this.app.workspace.activeEditor.getSelection()))
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
    //this.app.vault.off("create",  null)
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
