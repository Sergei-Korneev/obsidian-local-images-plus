commit 84ab22388d2478fd98009e6dc9c146bfa70a6321
Author: Sergei Korneev <s.m.korneev@yandex.ru>
Date:   Thu Oct 8 22:57:06 2026 +0500

    feat: add URL exclude regexps setting (newline separated) to skip downloading matching URLs

diff --git a/src/settingstab.ts b/src/settingstab.ts
index 74ec7c9..46efd80 100644
--- a/src/settingstab.ts
+++ b/src/settingstab.ts
@@ -254,6 +254,22 @@ export default class SettingTab extends PluginSettingTab {
                     })
             )
 
+        new Setting(containerEl)
+            .setName("URL exclude regexps")
+            .setDesc("One per line: regexps to exclude URLs when downloading. Example: 
+^https://example\.com/.*
+.*ads\..*")
+            .addTextArea((text) => {
+                text
+                    .setValue(this.plugin.settings.UrlExcludeRegexps || "")
+                    .onChange(async (value) => {
+                        this.plugin.settings.UrlExcludeRegexps = value
+                        await this.plugin.saveSettings()
+                    })
+                text.inputEl.rows = 4
+                text.inputEl.cols = 50
+            })
+
         new Setting(containerEl)
             .setName("Download unknown filetypes")
             .setDesc("Download unknown filetypes and save them with .unknown extension.")
