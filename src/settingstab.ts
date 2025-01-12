import {
    App,
    PluginSettingTab,
    Setting,
} from "obsidian"

import {
    displayError,
    logError,
    trimAny
} from "./utils"

import {
    APP_TITLE,
    setDebug,
    VERBOSE
} from "./config"

import LocalImagesPlugin from "./main"
import safeRegex from "safe-regex"




export default class SettingTab extends PluginSettingTab {
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
       // donheader.createEl("a", { text: "Support the project! ", href: "https://www.buymeacoffee.com/sergeikorneev", cls: "donheader_txt" })

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
            .setName("Process all new attachments")
            .setDesc("The plugin will also move all attachments from obsidian default folder to plugin folder.")
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.processAll)
                    .onChange(async (value) => {
                        this.plugin.settings.processAll = value
                        await this.plugin.saveSettings()
                    })
            )

        new Setting(containerEl)
            .setName("Use MD5 for new attachments (Pasted images and files)")
            .setDesc("The plugin will use MD5 when renaming all new attachments.")
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
            .setName("Convert PNG to JPEG (Web Images)")
            .setDesc("Convert all downloaded PNG files to JPEG. May reduce file size by several times, but can also affect performance.")
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.PngToJpeg)
                    .onChange(async (value) => {
                        this.plugin.settings.PngToJpeg = value
                        await this.plugin.saveSettings()
                    })
            )

            new Setting(containerEl)
            .setName("Convert PNG to JPEG (Pasted Images)")
            .setDesc("Convert all pasted PNG files to JPEG. May reduce file size by several times, but can also affect performance.")
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.PngToJpegLocal)
                    .onChange(async (value) => {
                        this.plugin.settings.PngToJpegLocal = value
                        await this.plugin.saveSettings()
                    })
            )


            new Setting(containerEl)
            .setName("Jpeg Quality")
            .setDesc("Jpeg quality selection (30 to 100).")
            .addText((text) =>
                text
                    .setValue(String(this.plugin.settings.JpegQuality))
                    .onChange(async (value: string) => {

                        let numberValue = Number(value)
                        if (
                            isNaN(numberValue) ||
                            !Number.isInteger(numberValue) ||
                            numberValue < 10 ||
                            numberValue > 100
                        ) {
                            displayError(
                                "The value should be a positive integer number between 10 and 100!"
                            )
                            return
                        }
                        this.plugin.settings.JpegQuality = numberValue
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
            .setDesc("The plugin will not download attachments with these extensions.")
            .addText((text) =>
                text
                    .setValue(this.plugin.settings.ignoredExt)
                    .onChange(async (value) => {
                        this.plugin.settings.ignoredExt = value
                        await this.plugin.saveSettings()
                    })
            )


            new Setting(containerEl)
            .setName("Do not create Obsidian attachment folder (For compatibility with other plugins)")
            .setDesc("The plugin will not create an Obsidian attachments folder. This may cause the plugin to behave incorrectly. ")
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.DoNotCreateObsFolder)
                    .onChange(async (value) => {
                        this.plugin.settings.DoNotCreateObsFolder = value
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
            .setDesc("Add [[original filename]] or [original filename](link to attachment) after replaced tag (only for file:// protocol or dropped/pasted files ).")
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.addNameOfFile)
                    .onChange(async (value) => {
                        this.plugin.settings.addNameOfFile = value
                        await this.plugin.saveSettings()
                    })
            )




        new Setting(containerEl)
            .setName("Include pattern")
            .setDesc(
                "Include only files with extensions only matching this pattern. Example: md|canvas"
            )
            .addText((text) =>
                text.setValue(this.plugin.settings.includeps).onChange(async (value) => {
                  
                    //Transform string to regex
                    let ExtArray = value.split("|")
                    if (ExtArray.length >= 1){
                       let regexconverted = trimAny(ExtArray.map((extension) => {if (trimAny(extension, [" ","|"]) !== "" ) {return  "(?<" + trimAny(extension, [" ","|"]) + ">.*\\." + trimAny(extension, [" ","|"]) + ")" }}).join("|"), [" ","|"]) 
                   

                    if (!safeRegex(value)) {
                        displayError(
                            "Unsafe regex! https://www.npmjs.com/package/safe-regex"
                        )
                        return
                    }
                    this.plugin.settings.includepattern = regexconverted
                    logError(regexconverted)
                    await this.plugin.saveSettings()
                }
                })
            )

        containerEl.createEl("h3", { text: "Orphaned attachments" })

        new Setting(containerEl)
            .setName("Remove files completely")
            .setDesc("Do not move orphaned files into the garbage can.")
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.removeOrphansCompl)
                    .onChange(async (value) => {
                        this.plugin.settings.removeOrphansCompl = value
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
            .setName("Date format")
            .setDesc(
                "Date format for ${date} variable. E.g. \
                 | MMMM Do YYYY, h:mm:ss a (March 20th 2024, 10:54:46 am) \
                 | dddd  (Wednesday)\
                 | MMM Do YY  (Mar 20th 24)"
            )
            .addText((text) =>
                text.setValue(this.plugin.settings.DateFormat).onChange(async (value) => {
                    if (value.match(/(\)|\(|\"|\'|\#|\]|\[|\:|\>|\<|\*|\|)/g) !== null) {
                        displayError(
                            "Unsafe folder name! Some chars are forbidden in some filesystems."
                        )
                        return
                    }
                    this.plugin.settings.DateFormat = value
                    await this.plugin.saveSettings()
                })
            )



        new Setting(containerEl)
            .setName("Folder to save new attachments")
            .setDesc("Select where all new attachments will be saved.\nYou can use templates e.g. _resouces/${date}/${notename}")
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
                  and the options 'Next to note in the folder specified below' / 'Relative to note' are selected.\
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


            containerEl.createEl("h3", { text: "Troubleshooting" })
            new Setting(containerEl)
            .setName("Debug")
            .setDesc("Enable debug output to console.")
            .addToggle((toggle) =>
                toggle
                    .setValue(VERBOSE)
                    .onChange(async (value) => {
                        setDebug(value)
                        await this.plugin.saveSettings()
                    })
            )

        this.displSw(containerEl)
    }
}
