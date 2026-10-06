import {
  Notice,
  Plugin,
  TFile,
  Editor,
  htmlToMarkdown,
  MarkdownView,
  TFolder,
  Menu,
  MenuItem,
} from "obsidian"

import SettingTab from "./settingstab"

import {
  imageTagProcessor,
  getMDir,
  getRDir,
  FrontMatterParser,
  splitFrontmatter,
  getFrontmatterSource,
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
  trimTags,
  readFromDiskB
} from "./utils"

import {
  APP_TITLE,
  ISettings,
  DEFAULT_SETTINGS,
  MD_SEARCH_PATTERN,
  FRONTMATTER_DOWNLOAD_PATTERN,
  NOTICE_TIMEOUT,
  TIMEOUT_LIKE_INFINITY,
  FRONTMATTER_SEARCH_PATTERN,
  TIME_DIFF
} from "./config"

import { UniqueQueue } from "./uniqueQueue"
import path from "path"
import { ModalW1 } from "./modal"
const fs = require('fs').promises



//import { count, log } from "console"

export default class LocalImagesPlugin extends Plugin {
  settings: ISettings
  modifiedQueue = new UniqueQueue<TFile>()
  intervalId = 0
  newfProcInt: number = 0
  newfCreated: Array<string> = []
  noteModified: Array<TFile> = []
  newfMoveReq: boolean = true
  newfCreatedByDownloader: Array<string> = []
  ctxMenuImageSrc: string = ""
  ctxMenuImageFile: TFile | null = null
  origMenuShow: ((evt?: MouseEvent) => any) | null = null



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
      })

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

    //the image widget builds its own context menu and never triggers workspace "editor-menu",
    //so remember the clicked remote image here and inject the item when the menu is about to show
    this.registerDomEvent(document, "contextmenu", (evt: MouseEvent) => {
      this.ctxMenuImageSrc = ""
      this.ctxMenuImageFile = null
      if (!this.settings.contextMenuDownload) { return }
      const target = evt.target
      if (!(target instanceof HTMLImageElement)) { return }
      try {
        const proto = new URL(target.src).protocol
        if (proto === "http:" || proto === "https:" || proto === "data:") {
          this.ctxMenuImageSrc = target.src
          const view = this.app.workspace.getActiveViewOfType(MarkdownView)
          this.ctxMenuImageFile = view?.file ?? null
        }
      } catch (e) {
        logError("contextmenu: not an absolute url: " + target.src)
      }
    }, true)

    const plugin = this
    this.origMenuShow = Menu.prototype.showAtMouseEvent
    Menu.prototype.showAtMouseEvent = function (evt?: MouseEvent) {
      const src = plugin.ctxMenuImageSrc
      const file = plugin.ctxMenuImageFile
      plugin.ctxMenuImageSrc = ""
      plugin.ctxMenuImageFile = null
      if (src && file && plugin.settings.contextMenuDownload) {
        this.addItem((item: MenuItem) => {
          item.setTitle("Download this image")
            .setSection("image")
            .setIcon("download")
            .onClick(() => { plugin.downloadSingleImage(file, src) })
        })
      }
      return plugin.origMenuShow.call(this, evt)
    }





    // Some file has been created

    this.app.vault.on('create', async (file: TFile) => {

      logError("New file created: " + file.path)

      if (this.ExemplaryOfMD(file.path) && !this.ThePathExcluded(String(file.parent?.path))) {
        this.onMdCreateFunc(file)
      } else {
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
        !this.ExemplaryOfMD(file.path) ||
        this.ThePathExcluded(String(file.parent?.path)) ||
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
      logError("File modified: " + file.path, false)

      if (!file ||
        !(file instanceof TFile) ||
        this.ThePathExcluded(String(file.parent?.path)) ||
        !this.ExemplaryOfMD(file.path)) {
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


  private normalizeRemoteUrl(link: string): string {
    const value = String(link ?? "").trim()
    try {
      return decodeURI(value)
    } catch (e) {
      return value
    }
  }

  //frontmatter 'source' is used as the second referer when downloading
  private noteSource(file: TFile, fmPart: string): string {
    let source = ""
    const cachedFm = this.app.metadataCache.getFileCache(file)?.frontmatter
    if (cachedFm) {
      for (const key of Object.keys(cachedFm)) {
        if (key.toLowerCase() === "source" && typeof cachedFm[key] === "string") {
          source = String(cachedFm[key]).trim()
          break
        }
      }
    }
    if (!source) { source = getFrontmatterSource(fmPart) }
    return source
  }

  //issue #125: download only the image the user right-clicked, keep the rest of the note untouched
  private async downloadSingleImage(file: TFile, targetUrl: string) {

    if (file == null) { return }

    try {
      const content = await this.app.vault.cachedRead(file)
      if (content.length == 0) { return }

      const [fmPart, bodyPart] = splitFrontmatter(content)
      const source = this.noteSource(file, fmPart)
      const processor = imageTagProcessor(this, file, this.settings, false, source)
      const target = this.normalizeRemoteUrl(targetUrl)

      const onlyTarget = (replPattern: any) => {
        if (this.normalizeRemoteUrl(String(replPattern.link ?? "")) !== target) {
          return replPattern.replp
        }
        return processor(replPattern)
      }

      let newFm = fmPart
      let failed = false

      if (this.settings.processFrontmatter) {
        const fmFixed = await replaceAsync(fmPart, FRONTMATTER_DOWNLOAD_PATTERN, onlyTarget)
        newFm = fmFixed[0]
        failed = failed || fmFixed[1]
      }

      const bodyFixed = await replaceAsync(bodyPart, MD_SEARCH_PATTERN, onlyTarget)
      failed = failed || bodyFixed[1]
      const newContent = newFm + bodyFixed[0]

      if (newContent !== content) {
        await this.app.vault.modify(file, newContent)
        showBalloon(`Image downloaded and linked in "${file.path}".`, this.settings.showNotifications)
      }
      else if (!failed) {
        showBalloon(`Remote image not found in "${file.path}" or it is already local.`, this.settings.showNotifications)
      }

    } catch (e) {
      logError("Single image download failed: " + e, false)
      showBalloon("Single image download failed: " + e.message, this.settings.showNotifications)
    }
  }

  private async processPage(file: TFile, defaultdir: boolean = false): Promise<any> {


    if (file == null) { return null }

    const content = await this.app.vault.cachedRead(file)

    if (content.length == 0) { return null }

    const [fmPart, bodyPart] = splitFrontmatter(content)

    const source = this.noteSource(file, fmPart)

    const processor = imageTagProcessor(this,
      file,
      this.settings,
      defaultdir,
      source
    )

    //the frontmatter is processed first: a bare url match inside the body must not touch the yaml header
    const fmFixed: any = (this.settings.processFrontmatter) ?
      await replaceAsync(
        fmPart,
        FRONTMATTER_DOWNLOAD_PATTERN,
        processor
      ) :
      [fmPart, false, []]

    const bodyFixed = await replaceAsync(
      bodyPart,
      MD_SEARCH_PATTERN,
      processor
    )

    const fixedContent: [string, boolean, Array<string>] = [
      fmFixed[0] + bodyFixed[0],
      fmFixed[1] || bodyFixed[1],
      [...fmFixed[2], ...bodyFixed[2]]
    ]





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

      if (fItems.length != 0 || this.ThePathExcluded(String(activeFile.parent?.path))) { return }

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

  private removeOrphans = (type: string = undefined, filesToRemove: Array<TFile> = undefined, noteFile: TFile = undefined) => async () => {

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
        let frembeds: { files: any[], urls: any[] } = { files: [], urls: [] };
        try {
          frembeds = await FrontMatterParser(this, noteFile, FRONTMATTER_SEARCH_PATTERN)
        } catch (e) {
          logError("Frontmatter of " + noteFile.path + " skipped: " + e)
          showBalloon("Frontmatter of '" + noteFile.path + "' skipped (parse error)", this.settings.showNotifications)
        }
logError(embeds)
logError(links)

        if (frembeds.files?.length > 0) {
          for (const frembed of frembeds.files) {
            allAttachmentsLinks.push(frembed.link)
          }
        }
        if (embeds) {
          for (const embed of embeds) {
            allAttachmentsLinks.push(path.parse(embed.link).name + trimTags(path.parse(embed.link).ext))
            logError(path.basename(embed.link))
          }
        }
        if (links) {
          for (const link of links) {
            allAttachmentsLinks.push(path.parse(link.link).name + trimTags(path.parse(link.link).ext))
             logError(path.basename(link.link))
          }
        }
        if (allAttachments) {
          for (const attach of allAttachments) {
            if (!allAttachmentsLinks.includes(attach.name) && attach.children == undefined) {
              logError("An orphan: " + attach.name)
              orphanedAttachments.push(attach)
            }
          }
        }
logError(allAttachments)

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
          if (file !== null && this.ExemplaryOfCANVAS(file.path)) {
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
                  //Undocumented API, may be altered in the future
                  const AllNodeLinks = (await this.app.internalPlugins.plugins.canvas.instance.index.parseText(node.text))?.links

                  logError(AllNodeLinks)

                  if (AllNodeLinks === undefined) { continue }

                  for (const Nodelink of AllNodeLinks) {
                    allAttachmentsLinks.push(path.basename(Nodelink.link))
                  }
                }
              }
            }



          }

          if (file !== null && this.ExemplaryOfMD(file.path)) {


            const metaCache = this.app.metadataCache.getCache(file.path)
            const embeds = metaCache?.embeds
            const links = metaCache?.links
            let frembeds: { files: any[], urls: any[] } = { files: [], urls: [] };
            try {
              frembeds = await FrontMatterParser(this, file, FRONTMATTER_SEARCH_PATTERN)
            } catch (e) {
              logError("Frontmatter of " + file.path + " skipped: " + e)
              showBalloon("Frontmatter of '" + file.path + "' skipped (parse error)", this.settings.showNotifications)
            }



            logError(embeds)
            logError(links)

            if (frembeds.files?.length > 0) {
              for (const frembed of frembeds.files) {
                allAttachmentsLinks.push(frembed.link)
              }
            }
            if (embeds) {
              for (const embed of embeds) {
                const parsedPath = path.parse(embed.link)
                allAttachmentsLinks.push(parsedPath.name + trimTags(parsedPath.ext))
              }
            }
            if (links) {
              for (const link of links) {
                const parsedPath = path.parse(link.link)
                allAttachmentsLinks.push(parsedPath.name + trimTags(parsedPath.ext))
              }
            }


          }
        }

        logError(allAttachments)

        for (const attach of allAttachments) {
          if (!allAttachmentsLinks.includes(attach.name) && attach.children == undefined) {
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
      let msg = ""

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

    if (timeGapMs > TIME_DIFF)
      return

    logError("func onMdCreateFunc: " + file.path)
    logError(file, true)


    var cont = await this.app.vault.cachedRead(file)

    logError(cont)

    this.enqueueActivePage(file)
    this.setupQueueInterval()
    this.setupNewMdFilesProcInterval()


  }

  private async onFCreateFunc(file: TFile) {

    if (!file ||
      !(file instanceof TFile) ||
      this.ExemplaryOfMD(file.path) ||
      this.ExemplaryOfCANVAS(file.path) ||
      !(this.settings.processAll))
      return

    if (!file.stat.ctime)
      return

    const timeGapMs = Math.abs(Date.now() - file.stat.mtime)

    if (timeGapMs > TIME_DIFF)
      return

    this.newfCreated.push(file.path)
    this.newfMoveReq = true
    this.setupNewMdFilesProcInterval()
    logError("file created  ")
  }


  private ExemplaryOfMD(pat: string) {
    const includeRegex = new RegExp(this.settings.includepattern, "i")
    return (pat.match(includeRegex)?.groups?.md != undefined)
  }


  private ExemplaryOfCANVAS(pat: string) {
    const includeRegex = new RegExp(this.settings.includepattern, "i")
    return (pat.match(includeRegex)?.groups?.canvas != undefined)
  }


  private ThePathExcluded(pat: string) {
    const includeRegex = new RegExp(this.settings.ExcludedFoldersListRegexp, "i")
    logError(pat.match(includeRegex))
    return (pat.match(includeRegex) != null && trimAny(this.settings.ExcludedFoldersList, [" "]).length != 0)
  }

  private  onRet() {
      logError("onret")
      logError("noteModified")
     
      this.newfCreated = []
      this.newfCreatedByDownloader = []
      this.noteModified = []
      this.newfMoveReq = false
      window.clearInterval(this.newfProcInt)
      this.newfProcInt = 0
    }

  private processMdFilesOnTimer = async () => {

    logError("processMdFilesOnTimer: \r\nNote:\r\n")
 
    try {

      window.clearInterval(this.newfProcInt)
      this.newfProcInt = 0
      this.newfMoveReq = false
      let itemcount = 0

      for (const note of this.noteModified) {

        const metaCache = this.app.metadataCache.getFileCache(note)
        let filedata = await this.app.vault.cachedRead(note)
        const mdir = await getMDir(this.app, note, this.settings)
        const obsmdir = await getMDir(this.app, note, this.settings, true)
        const embeds = metaCache?.embeds



        if (obsmdir != "" && ! await this.app.vault.adapter.exists(obsmdir)) {
          if (!this.settings.DoNotCreateObsFolder) {
            this.ensureFolderExists(obsmdir)
            showBalloon(`You obsidian media folder set to ${obsmdir}, and has been created by the plugin. Please, try again. `, this.settings.showNotifications)
            this.onRet()
          }
          return
        }


        if (embeds || MD_SEARCH_PATTERN.some(reg_p => reg_p.test(filedata))) {


          await this.ensureFolderExists(mdir)

          for (let el of embeds ?? []) {

            logError(el)


            const elBaseName = path.basename(el.link)
            let oldpath = pathJoin([obsmdir, elBaseName])
            let oldtag = el.original


            logError(this.newfCreated)

            if ((this.newfCreated.indexOf(el.link) != -1 || (obsmdir != "" && (this.newfCreated.includes(oldpath) || this.newfCreated.includes(el.link)))) && !this.newfCreatedByDownloader.includes(oldtag)) {


              if (! await this.app.vault.adapter.exists(oldpath)) {
                logError(`Cannot find ${el.link} skipping...`)
                continue
              }


              let newpath = pathJoin([mdir, cFileName(elBaseName)])
              let { pathWiki, pathMd } = await getRDir(note, this.settings, newpath)
              let newBinData: ArrayBuffer | null = null
              let newMD5: string | null = null
              const oldBinData = await readFromDiskB(pathJoin([this.app.vault.adapter.basePath, oldpath]), 5000)
              const oldMD5 = md5Sig(oldBinData)
              const fileExt = await getFileExt(oldBinData, oldpath)

              logError("oldbindata: ")
              logError(oldBinData)
              logError("oldext: " + fileExt)

              if (this.settings.PngToJpegLocal && fileExt == "png") {
                const compExt = (this.settings.ImgCompressionType == "image/webp") ? ".webp" : ".jpeg"
                logError("Compressing image to " + compExt)

                newBinData = await blobToJpegArrayBuffer(await this.app.vault.adapter.readBinary(oldpath), this.settings.JpegQuality * 0.01, this.settings.ImgCompressionType)

                newMD5 = md5Sig(newBinData)
                logError("newBinData: ")
                logError(newBinData)



                if (newBinData != null) {
                  newpath =
                    (this.settings.useMD5ForNewAtt) ? pathJoin([mdir, newMD5 + compExt]) : pathJoin([mdir, cFileName(path.parse(el.link)?.name + compExt)]);
                  ({ pathMd, pathWiki } = await getRDir(note, this.settings, newpath))
                }



              } else if (this.settings.useMD5ForNewAtt) {
                newpath = pathJoin([mdir, oldMD5 + path.extname(el.link)]);
                ({ pathMd, pathWiki } = await getRDir(note, this.settings, newpath))


              } else if (!this.settings.useMD5ForNewAtt) {
                newpath = pathJoin([mdir, cFileName(elBaseName)]);
                ({ pathMd, pathWiki } = await getRDir(note, this.settings, newpath))
              }

              if (await this.app.vault.adapter.exists(newpath)) {


                const newFMD5 = (newBinData != null) ?
                  md5Sig(await this.app.vault.adapter.readBinary(newpath)) :
                  md5Sig(await readFromDiskB(pathJoin([this.app.vault.adapter.basePath, newpath]), 5000))

                if (newMD5 === newFMD5 || (oldMD5 === newFMD5 && oldpath != newpath)) {

                  logError(path.dirname(oldpath))
                  logError("Deleting duplicate file: " + oldpath)
                  await this.app.vault.adapter.remove(oldpath)

                } else if (oldpath != newpath) {

                  logError("Renaming existing: " + oldpath)
                  let inc = 1
                  while (await this.app.vault.adapter.exists(newpath)) {
                    newpath = pathJoin([mdir, cFileName(elBaseName) + ` (${inc})`])
                    inc++
                  }

                  ({ pathMd, pathWiki } = await getRDir(note, this.settings, newpath))
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

              const TagsParams = {
                OldTag: oldtag,
                pathMd: pathMd,
                pathWiki: pathWiki
              }




             // const vvv = MarkdownLinkParser(el.link);
              const useMdLinks = this.app.vault.getConfig("useMarkdownLinks")

              let newtag = oldtag.replace(el.link, pathWiki)

              if (useMdLinks) {
                newtag = oldtag.replace(encObsURI(el.link), pathMd)
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
      this.onRet()
    }
    this.onRet()

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
    const iteration = this.modifiedQueue.iterationQueue()
    for (const page of iteration) {
      this.processPage(page, false)
    }
  }

  enqueueActivePage(activeFile: TFile) {
    this.modifiedQueue.push(
      activeFile,
      1//this.settings.realTim3AttemptsToProcess
    )
  }




  // ------------  Load / Save settings -----------------
  async onunload() {
    if (this.origMenuShow) {
      Menu.prototype.showAtMouseEvent = this.origMenuShow
      this.origMenuShow = null
    }
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
