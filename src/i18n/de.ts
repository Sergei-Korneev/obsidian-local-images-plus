export default {
  "Show notifications": "Benachrichtigungen anzeigen",
  "Show notifications when pages were processed.":
    "Benachrichtigungen anzeigen, wenn Seiten verarbeitet wurden.",
  "Context menu: download single image":
    "Kontextmenü: Einzelnes Bild herunterladen",
  "Show 'Download this image' when right-clicking a remote image in Live Preview. Downloads only that image and replaces its link.":
    "„Dieses Bild herunterladen“ anzeigen, wenn mit der rechten Maustaste auf ein externes Bild in der Live-Vorschau geklickt wird. Lädt nur dieses Bild herunter und ersetzt seinen Link.",
  "Disable additional commands": "Zusätzliche Befehle deaktivieren",
  "Do not show additional commands in command palette. Reload the plugin in settings to take effect (turn off/on).":
    "Zusätzliche Befehle nicht in der Befehlspalette anzeigen. Plugin in den Einstellungen neu laden, damit die Änderung wirksam wird (aus/ein).",
  "Automatic processing": "Automatische Verarbeitung",
  "Process notes on create/copy/paste.":
    "Notizen beim Erstellen/Kopieren/Einfügen verarbeiten.",
  "Process images in frontmatter": "Bilder im Frontmatter verarbeiten",
  "Download and localize image links in the YAML frontmatter. When disabled the frontmatter block is left untouched ('source' key is still used as referer for body images).":
    "Bildlinks im YAML-Frontmatter herunterladen und lokalisieren. Wenn deaktiviert, bleibt der Frontmatter-Block unberührt (der 'source'-Schlüssel wird weiterhin als Referrer für Körperbilder verwendet).",
  "Automatic processing interval": "Intervall der automatischen Verarbeitung",
  "Interval in seconds for processing update. It takes some time to reveal changed content of a note to plugins.":
    "Intervall in Sekunden für die Verarbeitungsaktualisierung. Es dauert etwas, bis geänderte Notiz-Inhalte für Plugins sichtbar sind.",
  "Number of retries for every single attachment":
    "Anzahl Wiederholungen für jeden einzelnen Anhang",
  "If an error occurs during downloading (network etc.) try to re-download several times.":
    "Wenn ein Fehler beim Herunterladen auftritt (Netzwerk etc.), mehrmals neu herunterladen versuchen.",
  "Process all new markdown files": "Alle neuen Markdown-Dateien verarbeiten",
  "Process all new created/cloud-synced files with corresponding extensions.":
    "Alle neu erstellten/cloud-synchronisierten Dateien mit entsprechenden Erweiterungen verarbeiten.",
  "Process all new attachments": "Alle neuen Anhänge verarbeiten",
  "The plugin will also move all attachments from obsidian default folder to plugin folder.":
    "Das Plugin verschiebt auch alle Anhänge vom standardmäßigen Obsidian-Ordner in den Plugin-Ordner.",
  "File name template": "Dateinamen-Vorlage",
  "Template for new attachment names. Variables: ${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}. Default: ${md5}_MD5 (backward compatible). Examples: ${originalname}, ${notename}-${originalname}, ${date}-${md5:8}. Use 'Folder to save new attachments' for subfolders.":
    "Vorlage für neue Anhangsnamen. Variablen: ${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}. Standard: ${md5}_MD5 (rückwärtskompatibel). Beispiele: ${originalname}, ${notename}-${originalname}, ${date}-${md5:8}. „Ordner für neue Anhänge“ für Unterordner verwenden.",
  "Use markdown link format with angle brackets ![](<link>)":
    "Markdown-Link-Format mit spitzen Klammern ![](<link>) verwenden",
  "Force using markdown link format with angle brackets instead of encoded URI when generating links.":
    "Erzwinge Verwendung des Markdown-Link-Formats mit spitzen Klammern statt kodiertem URI beim Generieren von Links.",
  "Process Canvas files": "Canvas-Dateien verarbeiten",
  "Process images in Obsidian Canvas (.canvas files)":
    "Bilder in Obsidian Canvas (.canvas-Dateien) verarbeiten",
  "URL exclude regexps": "URL-Ausschluss-Regex",
  "One per line: regexps to exclude URLs when downloading. Examples:\n^https://example\\.com/.*\n.*ads\\..*":
    "Eins pro Zeile: Regex zum Ausschließen von URLs beim Herunterladen. Beispiele:\n^https://example\\.com/.*\n.*ads\\..*",
  "Download unknown filetypes": "Unbekannte Dateitypen herunterladen",
  "Download unknown filetypes and save them with .unknown extension.":
    "Unbekannte Dateitypen herunterladen und mit .unknown-Erweiterung speichern.",
  "Compress images (Web Images)": "Bilder komprimieren (Web-Bilder)",
  "Compress all downloaded images. May reduce file size by several times, but can also affect performance.":
    "Alle heruntergeladenen Bilder komprimieren. Kann Dateigröße um ein Vielfaches verringern, aber auch Leistung beeinträchtigen.",
  "Compress images (Pasted Images)": "Bilder komprimieren (Eingefügte Bilder)",
  "Compress all pasted images. May reduce file size by several times, but can also affect performance.":
    "Alle eingefügten Bilder komprimieren. Kann Dateigröße um ein Vielfaches verringern, aber auch Leistung beeinträchtigen.",
  "Compression type": "Komprimierungstyp",
  "Select image compression type. Keep in mind that webp format has image size limitations.":
    "Bildkomprimierungstyp wählen. Beachten Sie, dass das WebP-Format Bildgrößenbeschränkungen hat.",
  "Excluded folders": "Ausgeschlossene Ordner",
  "Excluded folders. New files in these folders will not be processed automatically.":
    "Ausgeschlossene Ordner. Neue Dateien in diesen Ordnern werden nicht automatisch verarbeitet.",
  "Image Quality": "Bildqualität",
  "Image quality selection (30 to 100).": "Bildqualität-Auswahl (30 bis 100).",
  "File size lower limit in Kb": "Untere Dateigrößen-Grenze in KB",
  "Do not download files with size less than this value. Set 0 for no limit.":
    "Keine Dateien kleiner als diesen Wert herunterladen. 0 für kein Limit.",
  Exclusions: "Ausschlüsse",
  "The plugin will not download attachments with these extensions.":
    "Das Plugin lädt keine Anhänge mit diesen Erweiterungen herunter.",
  "Do not create Obsidian attachment folder (For compatibility with other plugins)":
    "Keinen Obsidian-Anhang-Ordner erstellen (Für Kompatibilität mit anderen Plugins)",
  "The plugin will not create an Obsidian attachments folder. This may cause the plugin to behave incorrectly. ":
    "Das Plugin erstellt keinen Obsidian-Anhang-Ordner. Dies kann dazu führen, dass das Plugin fehlerhaft funktioniert.",
  "Preserve link captions": "Link-Untertitel beibehalten",
  "Add media links captions to converted tags.":
    "Medien-Link-Untertitel zu konvertierten Tags hinzufügen.",
  "Include pattern": "Einschluss-Muster",
  "Include only files with extensions only matching this pattern. Example: md|canvas":
    "Nur Dateien mit Erweiterungen einschließen, die diesem Muster entsprechen. Beispiel: md|canvas",
  "Remove files completely": "Dateien vollständig entfernen",
  "Do not move orphaned files into the garbage can.":
    "Verwaiste Dateien nicht in den Papierkorb verschieben.",
  "How to write paths in tags": "Wie Pfade in Tags geschrieben werden",
  "Select whether to write full paths in tags or not.":
    "Wählen Sie, ob vollständige Pfade in Tags geschrieben werden sollen oder nicht.",
  "Date format": "Datumsformat",
  "Date format for ${date} variable. E.g. \n                  | MMMM Do YYYY, h:mm:ss a (March 20th 2024, 10:54:46 am) \n                  | dddd  (Wednesday)\n                  | MMM Do YY  (Mar 20th 24)":
    "Datumsformat für die ${date}-Variable. Z. B.\n                  | MMMM Do YYYY, h:mm:ss a (20. März 2024, 10:54:46) \n                  | dddd  (Mittwoch)\n                  | MMM Do YY  (Mär 20 24)",
  "Folder to save new attachments": "Ordner zum Speichern neuer Anhänge",
  "Select where all new attachments will be saved.\nYou can use templates e.g. _resouces/${date}/${notename}":
    "Wählen Sie, wo alle neuen Anhänge gespeichert werden.\nSie können Vorlagen verwenden z. B. _resources/${date}/${notename}",
  "Move/delete/rename media folder":
    "Medienordner verschieben/löschen/umbenennen",
  "Rename or move this folder to the obsidian or system garbage can when the associated note is deleted/renamed/moved. \n                  This setting takes effect only if the path contains ${notename} template at the end\n                  and the options 'Next to note in the folder specified below' / 'Relative to note' are selected.\n                  Use this setting at your own risk.":
    "Diesen Ordner in den Obsidian- oder System-Papierkorb umbenennen/verschieben, wenn die verknüpfte Notiz gelöscht/umbenannt/verschoben wird. \n                  Diese Einstellung wirkt nur, wenn der Pfad die ${notename}-Vorlage am Ende enthält\n                  und die Optionen „Neben Notiz im unten angegebenen Ordner“ / „Relativ zur Notiz“ ausgewählt sind.\n                  Auf eigene Gefahr verwenden.",
  "Media folder": "Medienordner",
  "Folder to keep all downloaded media files.":
    "Ordner für alle heruntergeladenen Mediendateien.",
  Debug: "Debug",
  "Enable debug output to console.": "Debug-Ausgabe in der Konsole aktivieren.",
  "Interface settings": "Oberflächeneinstellungen",
  "Processing settings": "Verarbeitungseinstellungen",
  "Note settings": "Notiz-Einstellungen",
  "Orphaned attachments": "Veraiste Anhänge",
  "Media folder settings": "Medienordner-Einstellungen",
  Troubleshooting: "Fehlerbehebung",
  "The value should be a positive integer number between 5 and 3600!":
    "Der Wert muss eine positive Ganzzahl zwischen 5 und 3600 sein!",
  "The value should be a positive integer number between 1 and 6!":
    "Der Wert muss eine positive Ganzzahl zwischen 1 und 6 sein!",
  "File name template cannot contain path separators. Use 'Folder to save new attachments' to set subfolders.":
    "Dateinamenvorlage darf keine Pfadtrennzeichen enthalten. Verwenden Sie „Ordner für neue Anhänge“ für Unterordner.",
  "The value should be a positive integer number between 10 and 100!":
    "Der Wert muss eine positive Ganzzahl zwischen 10 und 100 sein!",
  "The value should be a positive integer!":
    "Der Wert muss eine positive Ganzzahl sein!",
  "Unsafe regex! https://www.npmjs.com/package/safe-regex":
    "Unsicherer Regex! https://www.npmjs.com/package/safe-regex",
  "Unsafe folder name! Some chars are forbidden in some filesystems.":
    "Unsicherer Ordnername! Einige Zeichen sind in manchen Dateisystemen verboten.",
  WebP: "WebP",
  JPEG: "JPEG",
  "Full path": "Vollständiger Pfad",
  "Relative to note": "Relativ zur Notiz",
  "Only filename": "Nur Dateiname",
  "Copy Obsidian settings": "Obsidian-Einstellungen kopieren",
  "In the root folder specified below": "Im unten angegebenen Stammordner",
  "Next to note in the folder specified below":
    "Neben Notiz im unten angegebenen Ordner",

  "Attachment folder was renamed to {p}": "Anhängeordner wurde in {p} umbenannt",

  "Attachment folder {p} was moved to trash can.": "Anhängeordner {p} wurde in den Papierkorb verschoben.",

  "Attachments for '{p}' were processed.": "Anhänge für '{p}' wurden verarbeitet.",

  "Cannot get current note! ": "Aktuelle Notiz kann nicht ermittelt werden! ",

  "Cannot get current note/canvas!": "Aktuelle Notiz/Canvas kann nicht ermittelt werden!",

  "Cannot move attachment folder: \r\n{p}": "Anhängeordner kann nicht verschoben werden: \r\n{p}",

  "Cannot rename.": "Kann nicht umbenannt werden.",

  "Frontmatter of '{p}' skipped (parse error)": "Frontmatter von '{p}' übersprungen (Parse-Fehler)",

  "Image downloaded and linked in '{p}'.": "Bild heruntergeladen und in '{p}' verlinkt.",

  "Media links were found, processing...": "Medienlinks gefunden, wird verarbeitet...",

  "No orphaned files found!": "Keine verwaiste Dateien gefunden!",

  "Page '{p}' has been processed, but nothing was changed.": "Seite '{p}' wurde verarbeitet, aber nichts hat sich geändert.",

  "Please select a note or click inside selected note in canvas.": "Bitte wählen Sie eine Notiz oder klicken Sie in eine ausgewählte Notiz im Canvas.",

  "Please, select a note or click inside a note in canvas!": "Bitte wählen Sie eine Notiz oder klicken Sie in eine Notiz im Canvas!",

  "Remote image not found in '{p}' or it is already local.": "Remote-Bild in '{p}' nicht gefunden oder bereits lokal.",

  "Single image download failed: {p}": "Einzelner Bild-Download fehlgeschlagen: {p}",

  "The attachment folder {p} does not exist!": "Der Anhängeordner {p} existiert nicht!",

  "The note was renamed to {p}": "Die Notiz wurde in {p} umbenannt",

  "This command cannot run on vault's root or on subfolder next to note!\nPlease, change settings first!\r\n": "Dieser Befehl kann nicht im Vault-Stammverzeichnis oder in einem Unterordner neben der Notiz ausgeführt werden!\nBitte ändern Sie zuerst die Einstellungen!\r\n",

  "This command requires the settings 'Next to note in the folder specified below' and pattern '${notename}' at the end to be enabled, also the path cannot contain ${date} pattern.\nPlease, change settings first!\r\n": "Dieser Befehl erfordert die Einstellungen 'Neben Notiz im unten angegebenen Ordner' und das Muster '${notename}' am Ende aktiviert, der Pfad darf auch kein ${date}-Muster enthalten.\nBitte ändern Sie zuerst die Einstellungen!\r\n",

  "WARNING!\r\nAttachments for \'{p}\' were processed, but some attachments were not downloaded/replaced...": "WARNUNG!\r\nAnhänge für \'{p}\' wurden verarbeitet, aber einige Anhänge wurden nicht heruntergeladen/ersetzt...",

  "You obsidian media folder set to {p}, and has been created by the plugin. Please, try again.": "Ihr Obsidian-Medienordner ist auf {p} gesetzt und wurde vom Plugin erstellt. Bitte versuchen Sie es erneut.",

  "{p} attachments for note {p} were processed.": "{p} Anhänge für Notiz {p} wurden verarbeitet.",

  "{p} file(s) {p}": "{p} Datei(en) {p}",
};