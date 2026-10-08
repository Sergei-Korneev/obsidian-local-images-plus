import { App, PluginSettingTab, Setting } from "obsidian";

import { displayError, logError, trimAny } from "./utils";

import { APP_TITLE, setDebug, VERBOSE } from "./config";

import LocalImagesPlugin from "./main";
import safeRegex from "safe-regex";
import { translate } from "./i18n";

export default class SettingTab extends PluginSettingTab {
  plugin: LocalImagesPlugin;

  constructor(app: App, plugin: LocalImagesPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  displSw(cont: any): void {
    cont.findAll(".setting-item").forEach((el: any) => {
      if (el.getAttr("class").includes("media_folder_set")) {
        if (
          this.plugin.settings.saveAttE === "obsFolder" ||
          this.plugin.settings.saveAttE === "nextToNote"
        ) {
          el.hide();
        } else {
          el.show();
        }
      }
    });
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h1", { text: APP_TITLE });

    /* Buy Me a Coffee link removed as requested */

    containerEl.createEl("h3", { text: translate("Interface settings") });

    new Setting(containerEl)
      .setName(translate("Show notifications"))
      .setDesc(translate("Show notifications when pages were processed."))
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showNotifications)
          .onChange(async (value) => {
            this.plugin.settings.showNotifications = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(translate("Context menu: download single image"))
      .setDesc(
        translate(
          "Show 'Download this image' when right-clicking a remote image in Live Preview. Downloads only that image and replaces its link."
        )
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.contextMenuDownload)
          .onChange(async (value) => {
            this.plugin.settings.contextMenuDownload = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(translate("Disable additional commands"))
      .setDesc(
        translate(
          "Do not show additional commands in command palette. Reload the plugin in settings to take effect (turn off/on)."
        )
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.disAddCom)
          .onChange(async (value) => {
            this.plugin.settings.disAddCom = value;
            await this.plugin.saveSettings();
          })
      );

    containerEl.createEl("h3", { text: translate("Processing settings") });

    new Setting(containerEl)
      .setName(translate("Automatic processing"))
      .setDesc(translate("Process notes on create/copy/paste."))

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
      .setName(translate("Process images in frontmatter"))
      .setDesc(
        translate(
          "Download and localize image links in the YAML frontmatter. When disabled the frontmatter block is left untouched ('source' key is still used as referer for body images)."
        )
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.processFrontmatter)
          .onChange(async (value) => {
            this.plugin.settings.processFrontmatter = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(translate("Automatic processing interval"))
      .setDesc(
        translate(
          "Interval in seconds for processing update. It takes some time to reveal changed content of a note to plugins."
        )
      )
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
              displayError(
                translate(
                  "The value should be a positive integer number between 5 and 3600!"
                )
              );
              return;
            }

            if (numberValue < 5) {
              numberValue = 5;
            }
            this.plugin.settings.realTimeUpdateInterval = numberValue;
            await this.plugin.saveSettings();
            this.plugin.setupQueueInterval();
          })
      );

    new Setting(containerEl)
      .setName(translate("Number of retries for every single attachment"))
      .setDesc(
        translate(
          "If an error occurs during downloading (network etc.) try to re-download several times."
        )
      )
      .addText((text) =>
        text
          .setValue(String(this.plugin.settings.tryCount))
          .onChange(async (value: string) => {
            let numberValue = Number(value);
            if (
              isNaN(numberValue) ||
              !Number.isInteger(numberValue) ||
              numberValue < 1 ||
              numberValue > 6
            ) {
              displayError(
                translate(
                  "The value should be a positive integer number between 1 and 6!"
                )
              );
              return;
            }
            this.plugin.settings.tryCount = numberValue;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(translate("Process all new markdown files"))
      .setDesc(
        translate(
          "Process all new created/cloud-synced files with corresponding extensions."
        )
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.processCreated)
          .onChange(async (value) => {
            this.plugin.settings.processCreated = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(translate("Process all new attachments"))
      .setDesc(
        translate(
          "The plugin will also move all attachments from obsidian default folder to plugin folder."
        )
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.processAll)
          .onChange(async (value) => {
            this.plugin.settings.processAll = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(translate("File name template"))
      .setDesc(
        translate(
          "Template for new attachment names. Variables: ${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}. Default: ${md5}_MD5 (backward compatible). Examples: ${originalname}, ${notename}-${originalname}, ${date}-${md5:8}. Use 'Folder to save new attachments' for subfolders."
        )
      )
      .addText((text) =>
        text
          .setPlaceholder("${md5}_MD5")
          .setValue(this.plugin.settings.FileNameTemplate)
          .onChange(async (value) => {
            if (value.includes("/") || value.includes("\\")) {
              displayError(
                translate(
                  "File name template cannot contain path separators. Use 'Folder to save new attachments' to set subfolders."
                )
              );
              return;
            }
            this.plugin.settings.FileNameTemplate = value;
            await this.plugin.saveSettings();
          })
      )
      .setDesc(
        translate(
          "Template for new attachment names. Variables: ${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}. Default: ${md5}_MD5 (backward compatible). Examples: ${originalname}, ${notename}-${originalname}, ${date}-${md5:8}. Use Folder to save new attachments for subfolders."
        )
      );

    new Setting(containerEl)
      .setName(
        translate("Use markdown link format with angle brackets ![](<link>)")
      )
      .setDesc(
        translate(
          "Force using markdown link format with angle brackets instead of encoded URI when generating links."
        )
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.useMarkdownLinkFormat)
          .onChange(async (value) => {
            this.plugin.settings.useMarkdownLinkFormat = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(translate("Process Canvas files"))
      .setDesc(translate("Process images in Obsidian Canvas (.canvas files)"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.processCanvas)
          .onChange(async (value) => {
            this.plugin.settings.processCanvas = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(translate("URL exclude regexps"))
      .setDesc(
        translate(
          "One per line: regexps to exclude URLs when downloading. Examples:\n^https://example\\.com/.*\n.*ads\\..*"
        )
      )
      .addTextArea((text) => {
        text
          .setValue(this.plugin.settings.UrlExcludeRegexps || "")
          .onChange(async (value) => {
            this.plugin.settings.UrlExcludeRegexps = value;
            await this.plugin.saveSettings();
          });
        text.inputEl.rows = 4;
        text.inputEl.cols = 50;
      });

    new Setting(containerEl)
      .setName(translate("Download unknown filetypes"))
      .setDesc(
        translate(
          "Download unknown filetypes and save them with .unknown extension."
        )
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.downUnknown)
          .onChange(async (value) => {
            this.plugin.settings.downUnknown = value;
            await this.plugin.saveSettings();
          })
      );
    new Setting(containerEl)
      .setName(translate("Compress images (Web Images)"))
      .setDesc(
        translate(
          "Compress all downloaded images. May reduce file size by several times, but can also affect performance."
        )
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.PngToJpeg)
          .onChange(async (value) => {
            this.plugin.settings.PngToJpeg = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(translate("Compress images (Pasted Images)"))
      .setDesc(
        translate(
          "Compress all pasted images. May reduce file size by several times, but can also affect performance."
        )
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.PngToJpegLocal)
          .onChange(async (value) => {
            this.plugin.settings.PngToJpegLocal = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(translate("Compression type"))
      .setDesc(
        translate(
          "Select image compression type. Keep in mind that webp format has image size limitations."
        )
      )
      .addDropdown((dropdown) => {
        dropdown
          .addOption("image/webp", translate("WebP"))
          .addOption("image/jpeg", translate("JPEG"))
          .setValue(this.plugin.settings.ImgCompressionType)
          .onChange(async (value) => {
            this.plugin.settings.ImgCompressionType = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName(translate("Excluded folders"))
      .setDesc(
        translate(
          "Excluded folders. New files in these folders will not be processed automatically."
        )
      )
      .addTextArea((text) => {
        text
          .setPlaceholder(
            "Enter the full path in new lines, e.g. RootFolder/Subfolder."
          )
          .setValue(this.plugin.settings.ExcludedFoldersList)
          .onChange(async (value) => {
            let FoldersArray = value.split(/\r?\n|\r|\n/g);
            if (FoldersArray.length >= 1) {
              let regexconverted = trimAny(
                FoldersArray.map((path) => {
                  if (trimAny(path, [" ", "|", "/", "\\"]) !== "") {
                    return "(^" + trimAny(path, [" ", "|", "/", "\\"]) + "$)";
                  }
                })
                  .join("|")
                  .replace("\\", "/"),
                [" ", "|", "/", "\\"]
              );
              this.plugin.settings.ExcludedFoldersList = value;
              this.plugin.settings.ExcludedFoldersListRegexp = regexconverted;
              await this.plugin.saveSettings();
              logError("Excluded folders regex:" + regexconverted);
            }
          });

        text.inputEl.rows = 4;
        text.inputEl.style.width = "100%";
      });

    new Setting(containerEl)
      .setName(translate("Image Quality"))
      .setDesc(translate("Image quality selection (30 to 100)."))
      .addText((text) =>
        text
          .setValue(String(this.plugin.settings.JpegQuality))
          .onChange(async (value: string) => {
            let numberValue = Number(value);
            if (
              isNaN(numberValue) ||
              !Number.isInteger(numberValue) ||
              numberValue < 10 ||
              numberValue > 100
            ) {
              displayError(
                translate(
                  "The value should be a positive integer number between 10 and 100!"
                )
              );
              return;
            }
            this.plugin.settings.JpegQuality = numberValue;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(translate("File size lower limit in Kb"))
      .setDesc(
        translate(
          "Do not download files with size less than this value. Set 0 for no limit."
        )
      )
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
              displayError(
                translate("The value should be a positive integer!")
              );
              return;
            }

            if (numberValue < 0) {
              numberValue = 0;
            }
            this.plugin.settings.filesizeLimit = numberValue;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(translate("Exclusions"))
      .setDesc(
        translate(
          "The plugin will not download attachments with these extensions."
        )
      )
      .addText((text) =>
        text
          .setValue(this.plugin.settings.ignoredExt)
          .onChange(async (value) => {
            this.plugin.settings.ignoredExt = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(
        translate(
          "Do not create Obsidian attachment folder (For compatibility with other plugins)"
        )
      )
      .setDesc(
        translate(
          "The plugin will not create an Obsidian attachments folder. This may cause the plugin to behave incorrectly. "
        )
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.DoNotCreateObsFolder)
          .onChange(async (value) => {
            this.plugin.settings.DoNotCreateObsFolder = value;
            await this.plugin.saveSettings();
          })
      );

    containerEl.createEl("h3", { text: translate("Note settings") });

    new Setting(containerEl)
      .setName(translate("Preserve link captions"))
      .setDesc(translate("Add media links captions to converted tags."))
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.useCaptions)
          .onChange(async (value) => {
            this.plugin.settings.useCaptions = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(translate("Include pattern"))
      .setDesc(
        translate(
          "Include only files with extensions only matching this pattern. Example: md|canvas"
        )
      )
      .addText((text) =>
        text
          .setValue(this.plugin.settings.includeps)
          .onChange(async (value) => {
            //Transform string to regex
            let ExtArray = value.split("|");
            if (ExtArray.length >= 1) {
              let regexconverted = trimAny(
                ExtArray.map((extension) => {
                  if (trimAny(extension, [" ", "|"]) !== "") {
                    return (
                      "(?<" +
                      trimAny(extension, [" ", "|"]) +
                      ">.*\\." +
                      trimAny(extension, [" ", "|"]) +
                      ")"
                    );
                  }
                }).join("|"),
                [" ", "|"]
              );

              if (!safeRegex(value)) {
                displayError(
                  translate(
                    "Unsafe regex! https://www.npmjs.com/package/safe-regex"
                  )
                );
                return;
              }
              this.plugin.settings.includepattern = regexconverted;
              logError(regexconverted);
              await this.plugin.saveSettings();
            }
          })
      );

    containerEl.createEl("h3", { text: translate("Orphaned attachments") });

    new Setting(containerEl)
      .setName(translate("Remove files completely"))
      .setDesc(translate("Do not move orphaned files into the garbage can."))
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.removeOrphansCompl)
          .onChange(async (value) => {
            this.plugin.settings.removeOrphansCompl = value;
            await this.plugin.saveSettings();
          })
      );

    containerEl.createEl("h3", { text: translate("Media folder settings") });

    new Setting(containerEl)
      .setName(translate("How to write paths in tags"))
      .setDesc(translate("Select whether to write full paths in tags or not."))
      .addDropdown((text) =>
        text
          .addOption("fullDirPath", translate("Full path"))
          .addOption("onlyRelative", translate("Relative to note"))
          .addOption("baseFileName", translate("Only filename"))
          .setValue(this.plugin.settings.pathInTags)
          .onChange(async (value) => {
            this.plugin.settings.pathInTags = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(translate("Date format"))
      .setDesc(
        translate(
          "Date format for ${date} variable. E.g. \
                  | MMMM Do YYYY, h:mm:ss a (March 20th 2024, 10:54:46 am) \
                  | dddd  (Wednesday)\
                  | MMM Do YY  (Mar 20th 24)"
        )
      )
      .addText((text) =>
        text
          .setValue(this.plugin.settings.DateFormat)
          .onChange(async (value) => {
            if (
              value.match(/(\)|\(|\"|\'|\#|\]|\[|\:|\>|\<|\*|\|)/g) !== null
            ) {
              displayError(
                translate(
                  "Unsafe folder name! Some chars are forbidden in some filesystems."
                )
              );
              return;
            }
            this.plugin.settings.DateFormat = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(translate("Folder to save new attachments"))
      .setDesc(
        translate(
          "Select where all new attachments will be saved.\nYou can use templates e.g. _resouces/${date}/${notename}"
        )
      )
      .addDropdown((text) =>
        text
          .addOption("obsFolder", translate("Copy Obsidian settings"))
          .addOption(
            "inFolderBelow",
            translate("In the root folder specified below")
          )
          .addOption(
            "nextToNoteS",
            translate("Next to note in the folder specified below")
          )
          .setValue(this.plugin.settings.saveAttE)

          .onChange(async (value) => {
            this.plugin.settings.saveAttE = value;
            this.displSw(containerEl);

            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(translate("Move/delete/rename media folder"))
      .setDesc(
        translate(
          "Rename or move this folder to the obsidian or system garbage can when the associated note is deleted/renamed/moved. \
                  This setting takes effect only if the path contains ${notename} template at the end\
                  and the options 'Next to note in the folder specified below' / 'Relative to note' are selected.\
                  Use this setting at your own risk."
        )
      )
      .setClass("media_folder_set")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.removeMediaFolder)
          .onChange(async (value) => {
            this.plugin.settings.removeMediaFolder = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(translate("Media folder"))
      .setDesc(translate("Folder to keep all downloaded media files."))
      .setClass("media_folder_set")
      .addText((text) =>
        text
          .setValue(this.plugin.settings.mediaRootDir)
          .onChange(async (value) => {
            if (
              value.match(/(\)|\(|\"|\'|\#|\]|\[|\:|\>|\<|\*|\|)/g) !== null
            ) {
              displayError(
                translate(
                  "Unsafe folder name! Some chars are forbidden in some filesystems."
                )
              );
              return;
            }
            this.plugin.settings.mediaRootDir = value;
            await this.plugin.saveSettings();
          })
      );

    containerEl.createEl("h3", { text: translate("Troubleshooting") });
    new Setting(containerEl)
      .setName(translate("Debug"))
      .setDesc(translate("Enable debug output to console."))
      .addToggle((toggle) =>
        toggle.setValue(VERBOSE).onChange(async (value) => {
          setDebug(value);
          await this.plugin.saveSettings();
        })
      );

    this.displSw(containerEl);
  }
}
