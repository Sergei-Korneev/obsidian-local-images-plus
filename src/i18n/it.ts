export default {
  "Show notifications": "Mostra notifiche",
  "Show notifications when pages were processed.":
    "Mostra notifiche quando le pagine sono state elaborate.",
  "Context menu: download single image":
    "Menu contestuale: scarica singola immagine",
  "Show 'Download this image' when right-clicking a remote image in Live Preview. Downloads only that image and replaces its link.":
    "Mostra 'Scarica questa immagine' cliccando con il tasto destro su un'immagine remota in Anteprima Live. Scarica solo quell'immagine e sostituisce il suo link.",
  "Disable additional commands": "Disabilita comandi aggiuntivi",
  "Do not show additional commands in command palette. Reload the plugin in settings to take effect (turn off/on).":
    "Non mostrare comandi aggiuntivi nella tavolozza dei comandi. Ricarica il plugin nelle impostazioni per rendere effettive le modifiche (spegni/accendi).",
  "Automatic processing": "Elaborazione automatica",
  "Process notes on create/copy/paste.":
    "Elabora note alla creazione/copia/incolla.",
  "Process images in frontmatter": "Elabora immagini nel frontmatter",
  "Download and localize image links in the YAML frontmatter. When disabled the frontmatter block is left untouched ('source' key is still used as referer for body images).":
    "Scarica e localizza i link delle immagini nel frontmatter YAML. Quando disabilitato, il blocco frontmatter rimane intatto (la chiave 'source' è ancora usata come referer per le immagini del corpo).",
  "Automatic processing interval": "Intervallo elaborazione automatica",
  "Interval in seconds for processing update. It takes some time to reveal changed content of a note to plugins.":
    "Intervallo in secondi per l'aggiornamento dell'elaborazione. Ci vuole tempo per rivelare il contenuto modificato di una nota ai plugin.",
  "Number of retries for every single attachment":
    "Numero di tentativi per ogni singolo allegato",
  "If an error occurs during downloading (network etc.) try to re-download several times.":
    "Se si verifica un errore durante il download (rete ecc.) prova a riscaricare più volte.",
  "Process all new markdown files": "Elabora tutti i nuovi file markdown",
  "Process all new created/cloud-synced files with corresponding extensions.":
    "Elabora tutti i file nuovi creati/sincronizzati sul cloud con estensioni corrispondenti.",
  "Process all new attachments": "Elabora tutti i nuovi allegati",
  "The plugin will also move all attachments from obsidian default folder to plugin folder.":
    "Il plugin sposterà anche tutti gli allegati dalla cartella predefinita di Obsidian alla cartella del plugin.",
  "File name template": "Modello nome file",
  "Template for new attachment names. Variables: ${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}. Default: ${md5}_MD5 (backward compatible). Examples: ${originalname}, ${notename}-${originalname}, ${date}-${md5:8}. Use 'Folder to save new attachments' for subfolders.":
    "Modello per i nomi dei nuovi allegati. Variabili: ${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}. Predefinito: ${md5}_MD5 (compatibile con versioni precedenti). Esempi: ${originalname}, ${notename}-${originalname}, ${date}-${md5:8}. Usa 'Cartella per salvare nuovi allegati' per le sottocartelle.",
  "Use markdown link format with angle brackets ![](<link>)":
    "Usa formato link markdown con parentesi angolari ![](<link>)",
  "Force using markdown link format with angle brackets instead of encoded URI when generating links.":
    "Forza l'uso del formato link markdown con parentesi angolari invece di URI codificato quando si generano link.",
  "Process Canvas files": "Elabora file Canvas",
  "Process images in Obsidian Canvas (.canvas files)":
    "Elabora immagini in Obsidian Canvas (file .canvas)",
  "URL exclude regexps": "Regex per escludere URL",
  "One per line: regexps to exclude URLs when downloading. Examples:\n^https://example\\.com/.*\n.*ads\\..*":
    "Uno per riga: regex per escludere URL durante il download. Esempi:\n^https://example\\.com/.*\n.*ads\\..*",
  "Download unknown filetypes": "Scarica tipi di file sconosciuti",
  "Download unknown filetypes and save them with .unknown extension.":
    "Scarica tipi di file sconosciuti e salvali con estensione .unknown.",
  "Compress images (Web Images)": "Comprimi immagini (Immagini Web)",
  "Compress all downloaded images. May reduce file size by several times, but can also affect performance.":
    "Comprimi tutte le immagini scaricate. Può ridurre la dimensione del file di varie volte, ma può anche influire sulle prestazioni.",
  "Compress images (Pasted Images)": "Comprimi immagini (Immagini incollate)",
  "Compress all pasted images. May reduce file size by several times, but can also affect performance.":
    "Comprimi tutte le immagini incollate. Può ridurre la dimensione del file di varie volte, ma può anche influire sulle prestazioni.",
  "Compression type": "Tipo compressione",
  "Select image compression type. Keep in mind that webp format has image size limitations.":
    "Seleziona tipo di compressione immagine. Tieni presente che il formato webp ha limitazioni di dimensione immagine.",
  "Excluded folders": "Cartelle escluse",
  "Excluded folders. New files in these folders will not be processed automatically.":
    "Cartelle escluse. I nuovi file in queste cartelle non verranno elaborati automaticamente.",
  "Image Quality": "Qualità immagine",
  "Image quality selection (30 to 100).":
    "Selezione qualità immagine (da 30 a 100).",
  "File size lower limit in Kb": "Limite inferiore dimensione file in KB",
  "Do not download files with size less than this value. Set 0 for no limit.":
    "Non scaricare file con dimensioni inferiori a questo valore. Imposta 0 per nessun limite.",
  Exclusions: "Esclusioni",
  "The plugin will not download attachments with these extensions.":
    "Il plugin non scaricherà allegati con queste estensioni.",
  "Do not create Obsidian attachment folder (For compatibility with other plugins)":
    "Non creare cartella allegati Obsidian (Per compatibilità con altri plugin)",
  "The plugin will not create an Obsidian attachments folder. This may cause the plugin to behave incorrectly. ":
    "Il plugin non creerà una cartella allegati Obsidian. Questo potrebbe causare un comportamento errato del plugin.",
  "Preserve link captions": "Preserva didascalie link",
  "Add media links captions to converted tags.":
    "Aggiungi didascalie link media ai tag convertiti.",
  "Include pattern": "Modello inclusione",
  "Include only files with extensions only matching this pattern. Example: md|canvas":
    "Includi solo file con estensioni che corrispondono a questo modello. Esempio: md|canvas",
  "Remove files completely": "Rimuovi file completamente",
  "Do not move orphaned files into the garbage can.":
    "Non spostare file orfani nel cestino.",
  "How to write paths in tags": "Come scrivere percorsi nei tag",
  "Select whether to write full paths in tags or not.":
    "Seleziona se scrivere percorsi completi nei tag o no.",
  "Date format": "Formato data",
  "Date format for ${date} variable. E.g. \n                  | MMMM Do YYYY, h:mm:ss a (March 20th 2024, 10:54:46 am) \n                  | dddd  (Wednesday)\n                  | MMM Do YY  (Mar 20th 24)":
    "Formato data per la variabile ${date}. Es. :\n                  | MMMM Do YYYY, h:mm:ss a (20 marzo 2024, 10:54:46) \n                  | dddd  (mercoledì)\n                  | MMM Do YY  (mar 20 24)",
  "Folder to save new attachments": "Cartella per salvare nuovi allegati",
  "Select where all new attachments will be saved.\nYou can use templates e.g. _resouces/${date}/${notename}":
    "Seleziona dove verranno salvati tutti i nuovi allegati.\nPuoi usare modelli es. _resources/${date}/${notename}",
  "Move/delete/rename media folder": "Sposta/elimina/rinomina cartella media",
  "Rename or move this folder to the obsidian or system garbage can when the associated note is deleted/renamed/moved. \n                  This setting takes effect only if the path contains ${notename} template at the end\n                  and the options 'Next to note in the folder specified below' / 'Relative to note' are selected.\n                  Use this setting at your own risk.":
    "Rinomina o sposta questa cartella nel cestino di Obsidian o di sistema quando la nota associata è eliminata/rinominata/spostata. \n                  Questa impostazione ha effetto solo se il percorso contiene il modello ${notename} alla fine\n                  e le opzioni 'Accanto alla nota nella cartella specificata sotto' / 'Relativo alla nota' sono selezionate.\n                  Usa questa impostazione a tuo rischio.",
  "Media folder": "Cartella media",
  "Folder to keep all downloaded media files.":
    "Cartella per mantenere tutti i file media scaricati.",
  Debug: "Debug",
  "Enable debug output to console.": "Abilita output debug su console.",
  "Interface settings": "Impostazioni interfaccia",
  "Processing settings": "Impostazioni elaborazione",
  "Note settings": "Impostazioni note",
  "Orphaned attachments": "Allegati orfani",
  "Media folder settings": "Impostazioni cartella media",
  Troubleshooting: "Risoluzione problemi",
  "The value should be a positive integer number between 5 and 3600!":
    "Il valore deve essere un numero intero positivo tra 5 e 3600!",
  "The value should be a positive integer number between 1 and 6!":
    "Il valore deve essere un numero intero positivo tra 1 e 6!",
  "File name template cannot contain path separators. Use 'Folder to save new attachments' to set subfolders.":
    "Il modello del nome file non può contenere separatori di percorso. Usa 'Cartella per salvare nuovi allegati' per impostare le sottocartelle.",
  "The value should be a positive integer number between 10 and 100!":
    "Il valore deve essere un numero intero positivo tra 10 e 100!",
  "The value should be a positive integer!":
    "Il valore deve essere un numero intero positivo!",
  "Unsafe regex! https://www.npmjs.com/package/safe-regex":
    "Regex non sicuro! https://www.npmjs.com/package/safe-regex",
  "Unsafe folder name! Some chars are forbidden in some filesystems.":
    "Nome cartella non sicuro! Alcuni caratteri sono vietati in alcuni filesystem.",
  WebP: "WebP",
  JPEG: "JPEG",
  "Full path": "Percorso completo",
  "Relative to note": "Relativo alla nota",
  "Only filename": "Solo nome file",
  "Copy Obsidian settings": "Copia impostazioni Obsidian",
  "In the root folder specified below":
    "Nella cartella radice specificata sotto",
  "Next to note in the folder specified below":
    "Accanto alla nota nella cartella specificata sotto",

  "Cannot copy/download an attachment! Try to add referer in frontmatter 'source' field.": "Impossibile copiare/scaricare un allegato! Prova ad aggiungere referer nel campo 'source' del frontmatter.",

  "{p} file(s) {p}": "{p} file {p}",

  "{p} attachments for note {p}": "{p} allegati per la nota {p}",


  "Frontmatter of '{p}' skipped (parse error)": "Frontmatter di '{p}' saltato (errore di parsing)",

  "You obsidian media folder set to {p}, and has been created by the plugin. Please, try again.": "La cartella media di Obsidian impostata a {p} è stata creata dal plugin. Riprova.",

  "You obsidian media folder set to {p}, and has been changed to {p}. Please, note that the plugin settings might need to be updated.": "La cartella media di Obsidian impostata a {p} è stata cambiata in {p}. Potrebbe essere necessario aggiornare le impostazioni del plugin.",

  "Attachment folder was renamed to {p}": "La cartella degli allegati è stata rinominata in {p}",

  "Attachment folder {p} was moved to trash can.": "La cartella degli allegati {p} è stata spostata nel cestino.",

  "Attachments for '{p}' were processed.": "Gli allegati per '{p}' sono stati elaborati.",

  "Cannot get current note! ": "Impossibile ottenere la nota corrente! ",

  "Cannot get current note/canvas!": "Impossibile ottenere la nota/canvas corrente!",

  "Cannot move attachment folder: \r\n{p}": "Impossibile spostare la cartella degli allegati: \r\n{p}",

  "Cannot rename.": "Impossibile rinominare.",

  "Image downloaded and linked in '{p}'.": "Immagine scaricata e collegata in '{p}'.",

  "Media links were found, processing...": "Trovati collegamenti multimediali, elaborazione...",

  "No orphaned files found!": "Nessun file orfano trovato!",

  "Page '{p}' has been processed, but nothing was changed.": "La pagina '{p}' è stata elaborata, ma nulla è cambiato.",

  "Please select a note or click inside selected note in canvas.": "Seleziona una nota o clicca dentro la nota selezionata in canvas.",

  "Please, select a note or click inside a note in canvas!": "Seleziona una nota o clicca dentro una nota in canvas!",

  "Remote image not found in '{p}' or it is already local.": "Immagine remota non trovata in '{p}' o è già locale.",

  "Single image download failed: {p}": "Download singola immagine fallito: {p}",

  "The attachment folder {p} does not exist!": "La cartella degli allegati {p} non esiste!",

  "The note was renamed to {p}": "La nota è stata rinominata in {p}",

  "This command cannot run on vault's root or on subfolder next to note!\nPlease, change settings first!\r\n": "Questo comando non può essere eseguito nella root del vault o in una sottocartella accanto alla nota!\nPer favore, cambia prima le impostazioni!\r\n",

  "This command requires the settings 'Next to note in the folder specified below' and pattern '${notename}' at the end to be enabled, also the path cannot contain ${date} pattern.\nPlease, change settings first!\r\n": "Questo comando richiede le impostazioni 'Accanto alla nota nella cartella specificata sotto' e il pattern '${notename}' alla fine abilitato, anche il percorso non può contenere il pattern ${date}.\nPer favore, cambia prima le impostazioni!\r\n",

  "WARNING!\r\nAttachments for \'{p}\' were processed, but some attachments were not downloaded/replaced...": "ATTENZIONE!\r\nGli allegati per \'{p}\' sono stati elaborati, ma alcuni allegati non sono stati scaricati/sostituiti...",

  "{p} attachments for note {p} were processed.": "{p} allegati per la nota {p} elaborati.",
};