export default {
  "Show notifications": "Meldingen tonen",
  "Show notifications when pages were processed.":
    "Meldingen tonen wanneer pagina's zijn verwerkt.",
  "Context menu: download single image":
    "Contextmenu: enkele afbeelding downloaden",
  "Show 'Download this image' when right-clicking a remote image in Live Preview. Downloads only that image and replaces its link.":
    "Toon 'Deze afbeelding downloaden' bij rechtsklikken op een externe afbeelding in Live Preview. Downloadt alleen die afbeelding en vervangt de link.",
  "Disable additional commands": "Extra commando's uitschakelen",
  "Do not show additional commands in command palette. Reload the plugin in settings to take effect (turn off/on).":
    "Extra commando's niet tonen in het commandopalet. Herlaad de plugin in de instellingen om effect te laten treden (uit/aan).",
  "Automatic processing": "Automatische verwerking",
  "Process notes on create/copy/paste.":
    "Notities verwerken bij aanmaken/kopiëren/plakken.",
  "Process images in frontmatter": "Afbeeldingen in frontmatter verwerken",
  "Download and localize image links in the YAML frontmatter. When disabled the frontmatter block is left untouched ('source' key is still used as referer for body images).":
    "Afbeeldingslinks in de YAML frontmatter downloaden en lokaliseren. Wanneer uitgeschakeld blijft het frontmatter-blok ongewijzigd ('source' sleutel wordt nog steeds gebruikt als referer voor body-afbeeldingen).",
  "Automatic processing interval": "Interval automatische verwerking",
  "Interval in seconds for processing update. It takes some time to reveal changed content of a note to plugins.":
    "Interval in seconden voor verwerkingsupdate. Het duurt even voordat gewijzigde inhoud van een notitie zichtbaar is voor plugins.",
  "Number of retries for every single attachment":
    "Aantal pogingen voor elke enkele bijlage",
  "If an error occurs during downloading (network etc.) try to re-download several times.":
    "Als er een fout optreedt tijdens downloaden (netwerk etc.), probeer meerdere keren opnieuw te downloaden.",
  "Process all new markdown files": "Alle nieuwe markdown-bestanden verwerken",
  "Process all new created/cloud-synced files with corresponding extensions.":
    "Alle nieuw aangemaakte/cloud-gesynchroniseerde bestanden met bijbehorende extensies verwerken.",
  "Process all new attachments": "Alle nieuwe bijlagen verwerken",
  "The plugin will also move all attachments from obsidian default folder to plugin folder.":
    "De plugin verplaatst ook alle bijlagen van de standaard Obsidian-map naar de plugin-map.",
  "File name template": "Bestandsnaamsjabloon",
  "Template for new attachment names. Variables: ${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}. Default: ${md5}_MD5 (backward compatible). Examples: ${originalname}, ${notename}-${originalname}, ${date}-${md5:8}. Use 'Folder to save new attachments' for subfolders.":
    "Sjabloon voor nieuwe bijlagennamen. Variabelen: ${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}. Standaard: ${md5}_MD5 (achterwaarts compatibel). Voorbeelden: ${originalname}, ${notename}-${originalname}, ${date}-${md5:8}. Gebruik 'Map om nieuwe bijlagen op te slaan' voor submappen.",
  "Use markdown link format with angle brackets ![](<link>)":
    "Markdown-linkformaat met haakjes ![](<link>) gebruiken",
  "Force using markdown link format with angle brackets instead of encoded URI when generating links.":
    "Dwingen om markdown-linkformaat met haakjes te gebruiken in plaats van gecodeerde URI bij het genereren van links.",
  "Process Canvas files": "Canvas-bestanden verwerken",
  "Process images in Obsidian Canvas (.canvas files)":
    "Afbeeldingen in Obsidian Canvas (.canvas-bestanden) verwerken",
  "URL exclude regexps": "URL uitsluiting regexes",
  "One per line: regexps to exclude URLs when downloading. Examples:\n^https://example\\.com/.*\n.*ads\\..*":
    "Eén per regel: regexes om URLs uit te sluiten bij downloaden. Voorbeelden:\n^https://example\\.com/.*\n.*ads\\..*",
  "Download unknown filetypes": "Onbekende bestandstypen downloaden",
  "Download unknown filetypes and save them with .unknown extension.":
    "Onbekende bestandstypen downloaden en opslaan met .unknown extensie.",
  "Compress images (Web Images)": "Afbeeldingen comprimeren (Web-afbeeldingen)",
  "Compress all downloaded images. May reduce file size by several times, but can also affect performance.":
    "Alle gedownloade afbeeldingen comprimeren. Kan bestandsgrootte met een veelvoud verkleinen, maar kan ook prestaties beïnvloeden.",
  "Compress images (Pasted Images)":
    "Afbeeldingen comprimeren (Plakafbeeldingen)",
  "Compress all pasted images. May reduce file size by several times, but can also affect performance.":
    "Alle geplakte afbeeldingen comprimeren. Kan bestandsgrootte met een veelvoud verkleinen, maar kan ook prestaties beïnvloeden.",
  "Compression type": "Compressietype",
  "Select image compression type. Keep in mind that webp format has image size limitations.":
    "Selecteer afbeeldingcompressietype. Houd er rekening mee dat webp-formaat afbeeldingsgroottebeperkingen heeft.",
  "Excluded folders": "Uitgesloten mappen",
  "Excluded folders. New files in these folders will not be processed automatically.":
    "Uitgesloten mappen. Nieuwe bestanden in deze mappen worden niet automatisch verwerkt.",
  "Image Quality": "Afbeeldingskwaliteit",
  "Image quality selection (30 to 100).":
    "Afbeeldingskwaliteit selectie (30 tot 100).",
  "File size lower limit in Kb": "Ondergrens bestandsgrootte in KB",
  "Do not download files with size less than this value. Set 0 for no limit.":
    "Geen bestanden downloaden met een grootte kleiner dan deze waarde. Stel 0 in voor geen limiet.",
  Exclusions: "Uitsluitingen",
  "The plugin will not download attachments with these extensions.":
    "De plugin zal geen bijlagen met deze extensies downloaden.",
  "Do not create Obsidian attachment folder (For compatibility with other plugins)":
    "Geen Obsidian-bijlagemap aanmaken (Voor compatibiliteit met andere plugins)",
  "The plugin will not create an Obsidian attachments folder. This may cause the plugin to behave incorrectly. ":
    "De plugin maakt geen Obsidian-bijlagemap aan. Dit kan ertoe leiden dat de plugin onjuist gedraagt.",
  "Preserve link captions": "Linkbijschriften behouden",
  "Add media links captions to converted tags.":
    "Media-linkbijschriften toevoegen aan geconverteerde tags.",
  "Include pattern": "Inclusiepatroon",
  "Include only files with extensions only matching this pattern. Example: md|canvas":
    "Alleen bestanden opnemen met extensies die overeenkomen met dit patroon. Voorbeeld: md|canvas",
  "Remove files completely": "Bestanden volledig verwijderen",
  "Do not move orphaned files into the garbage can.":
    "Weesbestanden niet naar de prullenbak verplaatsen.",
  "How to write paths in tags": "Hoe paden in tags te schrijven",
  "Select whether to write full paths in tags or not.":
    "Selecteer of volledige paden in tags geschreven moeten worden of niet.",
  "Date format": "Datumformaat",
  "Date format for ${date} variable. E.g. \n                  | MMMM Do YYYY, h:mm:ss a (March 20th 2024, 10:54:46 am) \n                  | dddd  (Wednesday)\n                  | MMM Do YY  (Mar 20th 24)":
    "Datumformaat voor ${date} variabele. Bijv. :\n                  | MMMM Do YYYY, h:mm:ss a (20 maart 2024, 10:54:46) \n                  | dddd  (woensdag)\n                  | MMM Do YY  (mrt 20 24)",
  "Folder to save new attachments": "Map om nieuwe bijlagen op te slaan",
  "Select where all new attachments will be saved.\nYou can use templates e.g. _resouces/${date}/${notename}":
    "Selecteer waar alle nieuwe bijlagen opgeslagen zullen worden.\nJe kunt sjablonen gebruiken bv. _resources/${date}/${notename}",
  "Move/delete/rename media folder":
    "Media-map verplaatsen/verwijderen/hernoemen",
  "Rename or move this folder to the obsidian or system garbage can when the associated note is deleted/renamed/moved. \n                  This setting takes effect only if the path contains ${notename} template at the end\n                  and the options 'Next to note in the folder specified below' / 'Relative to note' are selected.\n                  Use this setting at your own risk.":
    "Deze map hernoemen of verplaatsen naar de Obsidian- of systeemprullenbak wanneer de gekoppelde notitie verwijderd/hernoemd/verplaatst wordt. \n                  Deze instelling werkt alleen als het pad de ${notename}-sjabloon aan het eind bevat\n                  en de opties 'Naar de notitie in de hieronder opgegeven map' / 'Relatief aan de notitie' geselecteerd zijn.\n                  Gebruik deze instelling op eigen risico.",
  "Media folder": "Media-map",
  "Folder to keep all downloaded media files.":
    "Map om alle gedownloade mediabestanden te bewaren.",
  Debug: "Foutopsporing",
  "Enable debug output to console.":
    "Foutopsporingsuitvoer naar console inschakelen.",
  "Interface settings": "Interface-instellingen",
  "Processing settings": "Verwerkingsinstellingen",
  "Note settings": "Notitie-instellingen",
  "Orphaned attachments": "Weesbijlagen",
  "Media folder settings": "Media-map instellingen",
  Troubleshooting: "Probleemoplossing",
  "The value should be a positive integer number between 5 and 3600!":
    "De waarde moet een positief geheel getal zijn tussen 5 en 3600!",
  "The value should be a positive integer number between 1 and 6!":
    "De waarde moet een positief geheel getal zijn tussen 1 en 6!",
  "File name template cannot contain path separators. Use 'Folder to save new attachments' to set subfolders.":
    "Bestandsnaamsjabloon mag geen padscheidingstekens bevatten. Gebruik 'Map om nieuwe bijlagen op te slaan' voor submappen.",
  "The value should be a positive integer number between 10 and 100!":
    "De waarde moet een positief geheel getal zijn tussen 10 en 100!",
  "The value should be a positive integer!":
    "De waarde moet een positief geheel getal zijn!",
  "Unsafe regex! https://www.npmjs.com/package/safe-regex":
    "Onveilige regex! https://www.npmjs.com/package/safe-regex",
  "Unsafe folder name! Some chars are forbidden in some filesystems.":
    "Onveilige mapnaam! Sommige tekens zijn verboden in sommige bestandssystemen.",
  WebP: "WebP",
  JPEG: "JPEG",
  "Full path": "Volledig pad",
  "Relative to note": "Relatief aan notitie",
  "Only filename": "Alleen bestandsnaam",
  "Copy Obsidian settings": "Obsidian-instellingen kopiëren",
  "In the root folder specified below": "In de hieronder opgegeven rootmap",
  "Next to note in the folder specified below":
    "Naar de notitie in de hieronder opgegeven map",

  "Cannot copy/download an attachment! Try to add referer in frontmatter 'source' field.": "Kan bijlage niet kopiëren/downloaden! Probeer referer toe te voegen aan het 'source' veld in frontmatter.",

  "{p} file(s) {p}": "{p} bestand(en) {p}",

  "{p} attachments for note {p}": "{p} bijlagen voor notitie {p}",

  "{p} attachments for note {p}": "{p} bijlagen voor notitie {p}",

  "Frontmatter of '{p}' skipped (parse error)": "Frontmatter van '{p}' overgeslagen (parsefout)",

  "You obsidian media folder set to {p}, and has been created by the plugin. Please, try again.": "De mediummap van Obsidian is ingesteld op {p} en is door de plugin aangemaakt. Probeer het opnieuw.",

  "You obsidian media folder set to {p}, and has been changed to {p}. Please, note that the plugin settings might need to be updated.": "De mediummap van Obsidian is gewijzigd van {p} naar {p}. Mogelijk moeten de plugininstellingen worden bijgewerkt.",
};