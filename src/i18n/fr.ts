export default {
  "Show notifications": "Afficher les notifications",
  "Show notifications when pages were processed.":
    "Afficher les notifications lorsque les pages ont été traitées.",
  "Context menu: download single image":
    "Menu contextuel : télécharger une seule image",
  "Show 'Download this image' when right-clicking a remote image in Live Preview. Downloads only that image and replaces its link.":
    "Afficher 'Télécharger cette image' lors du clic droit sur une image distante dans l'aperçu en direct. Télécharge uniquement cette image et remplace son lien.",
  "Disable additional commands": "Désactiver les commandes supplémentaires",
  "Do not show additional commands in command palette. Reload the plugin in settings to take effect (turn off/on).":
    "Ne pas afficher les commandes supplémentaires dans la palette de commandes. Rechargez le plugin dans les paramètres pour que cela prenne effet (désactiver/réactiver).",
  "Automatic processing": "Traitement automatique",
  "Process notes on create/copy/paste.":
    "Traiter les notes lors de la création/copie/collage.",
  "Process images in frontmatter": "Traiter les images dans le frontmatter",
  "Download and localize image links in the YAML frontmatter. When disabled the frontmatter block is left untouched ('source' key is still used as referer for body images).":
    "Télécharger et localiser les liens d'images dans le frontmatter YAML. Lorsque désactivé, le bloc frontmatter reste intact (la clé 'source' est toujours utilisée comme référent pour les images du corps).",
  "Automatic processing interval": "Intervalle de traitement automatique",
  "Interval in seconds for processing update. It takes some time to reveal changed content of a note to plugins.":
    "Intervalle en secondes pour la mise à jour du traitement. Il faut un certain temps pour révéler le contenu modifié d'une note aux plugins.",
  "Number of retries for every single attachment":
    "Nombre de tentatives pour chaque pièce jointe",
  "If an error occurs during downloading (network etc.) try to re-download several times.":
    "Si une erreur se produit pendant le téléchargement (réseau, etc.), essayer de re-télécharger plusieurs fois.",
  "Process all new markdown files":
    "Traiter tous les nouveaux fichiers markdown",
  "Process all new created/cloud-synced files with corresponding extensions.":
    "Traiter tous les fichiers nouvellement créés/synchronisés dans le cloud avec les extensions correspondantes.",
  "Process all new attachments": "Traiter toutes les nouvelles pièces jointes",
  "The plugin will also move all attachments from obsidian default folder to plugin folder.":
    "Le plugin déplacera également toutes les pièces jointes du dossier par défaut d'Obsidian vers le dossier du plugin.",
  "File name template": "Modèle de nom de fichier",
  "Template for new attachment names. Variables: ${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}. Default: ${md5}_MD5 (backward compatible). Examples: ${originalname}, ${notename}-${originalname}, ${date}-${md5:8}. Use 'Folder to save new attachments' for subfolders.":
    "Modèle pour les noms des nouvelles pièces jointes. Variables : ${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}. Défaut : ${md5}_MD5 (compatible avec les versions antérieures). Exemples : ${originalname}, ${notename}-${originalname}, ${date}-${md5:8}. Utilisez 'Dossier pour sauvegarder les nouvelles pièces jointes' pour les sous-dossiers.",
  "Use markdown link format with angle brackets ![](<link>)":
    "Utiliser le format de lien markdown avec crochets ![](<link>)",
  "Force using markdown link format with angle brackets instead of encoded URI when generating links.":
    "Forcer l'utilisation du format de lien markdown avec crochets au lieu d'URI encodé lors de la génération des liens.",
  "Process Canvas files": "Traiter les fichiers Canvas",
  "Process images in Obsidian Canvas (.canvas files)":
    "Traiter les images dans Obsidian Canvas (fichiers .canvas)",
  "URL exclude regexps": "Expressions régulières d'exclusion d'URL",
  "One per line: regexps to exclude URLs when downloading. Examples:\n^https://example\\.com/.*\n.*ads\\..*":
    "Une par ligne : expressions régulières pour exclure les URLs lors du téléchargement. Exemples :\n^https://example\\.com/.*\n.*ads\\..*",
  "Download unknown filetypes": "Télécharger les types de fichiers inconnus",
  "Download unknown filetypes and save them with .unknown extension.":
    "Télécharger les types de fichiers inconnus et les enregistrer avec l'extension .unknown.",
  "Compress images (Web Images)": "Compresser les images (Images Web)",
  "Compress all downloaded images. May reduce file size by several times, but can also affect performance.":
    "Compresser toutes les images téléchargées. Peut réduire la taille du fichier de plusieurs fois, mais peut aussi affecter les performances.",
  "Compress images (Pasted Images)": "Compresser les images (Images collées)",
  "Compress all pasted images. May reduce file size by several times, but can also affect performance.":
    "Compresser toutes les images collées. Peut réduire la taille du fichier de plusieurs fois, mais peut aussi affecter les performances.",
  "Compression type": "Type de compression",
  "Select image compression type. Keep in mind that webp format has image size limitations.":
    "Sélectionner le type de compression d'image. Gardez à l'esprit que le format webp a des limitations de taille d'image.",
  "Excluded folders": "Dossiers exclus",
  "Excluded folders. New files in these folders will not be processed automatically.":
    "Dossiers exclus. Les nouveaux fichiers dans ces dossiers ne seront pas traités automatiquement.",
  "Image Quality": "Qualité d'image",
  "Image quality selection (30 to 100).":
    "Sélection de la qualité d'image (30 à 100).",
  "File size lower limit in Kb": "Limite inférieure de taille de fichier en Ko",
  "Do not download files with size less than this value. Set 0 for no limit.":
    "Ne pas télécharger les fichiers dont la taille est inférieure à cette valeur. Mettre 0 pour aucune limite.",
  Exclusions: "Exclusions",
  "The plugin will not download attachments with these extensions.":
    "Le plugin ne téléchargera pas les pièces jointes avec ces extensions.",
  "Do not create Obsidian attachment folder (For compatibility with other plugins)":
    "Ne pas créer le dossier de pièces jointes Obsidian (Pour compatibilité avec d'autres plugins)",
  "The plugin will not create an Obsidian attachments folder. This may cause the plugin to behave incorrectly. ":
    "Le plugin ne créera pas de dossier de pièces jointes Obsidian. Cela peut provoquer un comportement incorrect du plugin.",
  "Preserve link captions": "Conserver les légendes des liens",
  "Add media links captions to converted tags.":
    "Ajouter les légendes des liens médias aux balises converties.",
  "Include pattern": "Modèle d'inclusion",
  "Include only files with extensions only matching this pattern. Example: md|canvas":
    "Inclure uniquement les fichiers avec extensions correspondant à ce modèle. Exemple : md|canvas",
  "Remove files completely": "Supprimer les fichiers complètement",
  "Do not move orphaned files into the garbage can.":
    "Ne pas déplacer les fichiers orphelins dans la corbeille.",
  "How to write paths in tags": "Comment écrire les chemins dans les tags",
  "Select whether to write full paths in tags or not.":
    "Sélectionner si les chemins complets doivent être écrits dans les tags ou non.",
  "Date format": "Format de date",
  "Date format for ${date} variable. E.g. \n                  | MMMM Do YYYY, h:mm:ss a (March 20th 2024, 10:54:46 am) \n                  | dddd  (Wednesday)\n                  | MMM Do YY  (Mar 20th 24)":
    "Format de date pour la variable ${date}. Ex. :\n                  | MMMM Do YYYY, h:mm:ss a (20 mars 2024, 10:54:46) \n                  | dddd  (mercredi)\n                  | MMM Do YY  (mar 20 24)",
  "Folder to save new attachments":
    "Dossier pour sauvegarder les nouvelles pièces jointes",
  "Select where all new attachments will be saved.\nYou can use templates e.g. _resouces/${date}/${notename}":
    "Sélectionner où toutes les nouvelles pièces jointes seront sauvegardées.\nVous pouvez utiliser des modèles, par ex. _resources/${date}/${notename}",
  "Move/delete/rename media folder":
    "Déplacer/supprimer/renommer le dossier média",
  "Rename or move this folder to the obsidian or system garbage can when the associated note is deleted/renamed/moved. \n                  This setting takes effect only if the path contains ${notename} template at the end\n                  and the options 'Next to note in the folder specified below' / 'Relative to note' are selected.\n                  Use this setting at your own risk.":
    "Renommer ou déplacer ce dossier dans la corbeille Obsidian ou système lorsque la note associée est supprimée/renommée/déplacée. \n                  Ce paramètre ne prend effet que si le chemin contient le modèle ${notename} à la fin\n                  et que les options 'À côté de la note dans le dossier spécifié ci-dessous' / 'Relatif à la note' sont sélectionnées.\n                  Utilisez ce paramètre à vos propres risques.",
  "Media folder": "Dossier média",
  "Folder to keep all downloaded media files.":
    "Dossier pour conserver tous les fichiers média téléchargés.",
  Debug: "Débogage",
  "Enable debug output to console.":
    "Activer la sortie de débogage dans la console.",
  "Interface settings": "Paramètres de l'interface",
  "Processing settings": "Paramètres de traitement",
  "Note settings": "Paramètres des notes",
  "Orphaned attachments": "Pièces jointes orphelines",
  "Media folder settings": "Paramètres du dossier média",
  Troubleshooting: "Dépannage",
  "The value should be a positive integer number between 5 and 3600!":
    "La valeur doit être un entier positif entre 5 et 3600 !",
  "The value should be a positive integer number between 1 and 6!":
    "La valeur doit être un entier positif entre 1 et 6 !",
  "File name template cannot contain path separators. Use 'Folder to save new attachments' to set subfolders.":
    "Le modèle de nom de fichier ne peut pas contenir de séparateurs de chemin. Utilisez 'Dossier pour sauvegarder les nouvelles pièces jointes' pour définir les sous-dossiers.",
  "The value should be a positive integer number between 10 and 100!":
    "La valeur doit être un entier positif entre 10 et 100 !",
  "The value should be a positive integer!":
    "La valeur doit être un entier positif !",
  "Unsafe regex! https://www.npmjs.com/package/safe-regex":
    "Regex non sécurisé ! https://www.npmjs.com/package/safe-regex",
  "Unsafe folder name! Some chars are forbidden in some filesystems.":
    "Nom de dossier non sécurisé ! Certains caractères sont interdits dans certains systèmes de fichiers.",
  WebP: "WebP",
  JPEG: "JPEG",
  "Full path": "Chemin complet",
  "Relative to note": "Relatif à la note",
  "Only filename": "Nom de fichier seulement",
  "Copy Obsidian settings": "Copier les paramètres Obsidian",
  "In the root folder specified below":
    "Dans le dossier racine spécifié ci-dessous",
  "Next to note in the folder specified below":
    "À côté de la note dans le dossier spécifié ci-dessous",

  "Cannot copy/download an attachment! Try to add referer in frontmatter 'source' field.": "Impossible de copier/télécharger une pièce jointe ! Essayez d'ajouter un referer dans le champ 'source' du frontmatter.",
};