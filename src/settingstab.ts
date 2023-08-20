import {
    App,
    PluginSettingTab,
    Setting,
} from "obsidian"

import {
    displayError,
} from "./utils"

import {
    APP_TITLE
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
        this.displSw(containerEl)
    }
}
