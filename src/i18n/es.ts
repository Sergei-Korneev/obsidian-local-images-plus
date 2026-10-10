export default {
  "Show notifications": "Mostrar notificaciones",
  "Show notifications when pages were processed.":
    "Mostrar notificaciones cuando se procesaron las páginas.",
  "Context menu: download single image":
    "Menú contextual: descargar imagen individual",
  "Show 'Download this image' when right-clicking a remote image in Live Preview. Downloads only that image and replaces its link.":
    "Mostrar 'Descargar esta imagen' al hacer clic derecho en una imagen remota en Vista Previa. Descarga solo esa imagen y reemplaza su enlace.",
  "Disable additional commands": "Deshabilitar comandos adicionales",
  "Do not show additional commands in command palette. Reload the plugin in settings to take effect (turn off/on).":
    "No mostrar comandos adicionales en la paleta de comandos. Recargue el plugin en la configuración para que surta efecto (apagar/encender).",
  "Automatic processing": "Procesamiento automático",
  "Process notes on create/copy/paste.":
    "Procesar notas al crear/copiar/pegar.",
  "Process images in frontmatter": "Procesar imágenes en frontmatter",
  "Download and localize image links in the YAML frontmatter. When disabled the frontmatter block is left untouched ('source' key is still used as referer for body images).":
    "Descargar y localizar enlaces de imágenes en el frontmatter YAML. Cuando está desactivado, el bloque frontmatter queda intacto (la clave 'source' se sigue usando como referer para imágenes del cuerpo).",
  "Automatic processing interval": "Intervalo de procesamiento automático",
  "Interval in seconds for processing update. It takes some time to reveal changed content of a note to plugins.":
    "Intervalo en segundos para actualización de procesamiento. Toma tiempo revelar el contenido cambiado de una nota a los plugins.",
  "Number of retries for every single attachment":
    "Número de reintentos para cada adjunto",
  "If an error occurs during downloading (network etc.) try to re-download several times.":
    "Si ocurre un error durante la descarga (red, etc.) intentar re-descargar varias veces.",
  "Process all new markdown files":
    "Procesar todos los nuevos archivos markdown",
  "Process all new created/cloud-synced files with corresponding extensions.":
    "Procesar todos los archivos nuevos creados/sincronizados en la nube con extensiones correspondientes.",
  "Process all new attachments": "Procesar todos los nuevos adjuntos",
  "The plugin will also move all attachments from obsidian default folder to plugin folder.":
    "El plugin también moverá todos los adjuntos de la carpeta predeterminada de Obsidian a la carpeta del plugin.",
  "File name template": "Plantilla de nombre de archivo",
  "Template for new attachment names. Variables: ${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}. Default: ${md5}_MD5 (backward compatible). Examples: ${originalname}, ${notename}-${originalname}, ${date}-${md5:8}. Use 'Folder to save new attachments' for subfolders.":
    "Plantilla para nombres de nuevos adjuntos. Variables: ${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}. Por defecto: ${md5}_MD5 (compatible hacia atrás). Ejemplos: ${originalname}, ${notename}-${originalname}, ${date}-${md5:8}. Use 'Carpeta para guardar nuevos adjuntos' para subcarpetas.",
  "Use markdown link format with angle brackets ![](<link>)":
    "Usar formato de enlace markdown con corchetes angulares ![](<link>)",
  "Force using markdown link format with angle brackets instead of encoded URI when generating links.":
    "Forzar el uso de formato de enlace markdown con corchetes angulares en lugar de URI codificado al generar enlaces.",
  "Process Canvas files": "Procesar archivos Canvas",
  "Process images in Obsidian Canvas (.canvas files)":
    "Procesar imágenes en Obsidian Canvas (archivos .canvas)",
  "URL exclude regexps": "Expresiones regulares para excluir URLs",
  "One per line: regexps to exclude URLs when downloading. Examples:\n^https://example\\.com/.*\n.*ads\\..*":
    "Una por línea: expresiones regulares para excluir URLs al descargar. Ejemplos:\n^https://example\\.com/.*\n.*ads\\..*",
  "Download unknown filetypes": "Descargar tipos de archivo desconocidos",
  "Download unknown filetypes and save them with .unknown extension.":
    "Descargar tipos de archivo desconocidos y guardarlos con extensión .unknown.",
  "Compress images (Web Images)": "Comprimir imágenes (Imágenes Web)",
  "Compress all downloaded images. May reduce file size by several times, but can also affect performance.":
    "Comprimir todas las imágenes descargadas. Puede reducir el tamaño del archivo varias veces, pero también puede afectar el rendimiento.",
  "Compress images (Pasted Images)": "Comprimir imágenes (Imágenes pegadas)",
  "Compress all pasted images. May reduce file size by several times, but can also affect performance.":
    "Comprimir todas las imágenes pegadas. Puede reducir el tamaño del archivo varias veces, pero también puede afectar el rendimiento.",
  "Compression type": "Tipo de compresión",
  "Select image compression type. Keep in mind that webp format has image size limitations.":
    "Seleccionar tipo de compresión de imagen. Tenga en cuenta que el formato webp tiene limitaciones de tamaño de imagen.",
  "Excluded folders": "Carpetas excluidas",
  "Excluded folders. New files in these folders will not be processed automatically.":
    "Carpetas excluidas. Los nuevos archivos en estas carpetas no se procesarán automáticamente.",
  "Image Quality": "Calidad de imagen",
  "Image quality selection (30 to 100).":
    "Selección de calidad de imagen (30 a 100).",
  "File size lower limit in Kb": "Límite inferior de tamaño de archivo en KB",
  "Do not download files with size less than this value. Set 0 for no limit.":
    "No descargar archivos con tamaño menor a este valor. Establezca 0 para sin límite.",
  Exclusions: "Exclusiones",
  "The plugin will not download attachments with these extensions.":
    "El plugin no descargará adjuntos con estas extensiones.",
  "Do not create Obsidian attachment folder (For compatibility with other plugins)":
    "No crear carpeta de adjuntos Obsidian (Para compatibilidad con otros plugins)",
  "The plugin will not create an Obsidian attachments folder. This may cause the plugin to behave incorrectly. ":
    "El plugin no creará una carpeta de adjuntos Obsidian. Esto puede causar que el plugin se comporte incorrectamente.",
  "Preserve link captions": "Conservar leyendas de enlaces",
  "Add media links captions to converted tags.":
    "Añadir leyendas de enlaces multimedia a etiquetas convertidas.",
  "Include pattern": "Patrón de inclusión",
  "Include only files with extensions only matching this pattern. Example: md|canvas":
    "Incluir solo archivos con extensiones que coincidan con este patrón. Ejemplo: md|canvas",
  "Remove files completely": "Eliminar archivos completamente",
  "Do not move orphaned files into the garbage can.":
    "No mover archivos huérfanos a la papelera.",
  "How to write paths in tags": "Cómo escribir rutas en etiquetas",
  "Select whether to write full paths in tags or not.":
    "Seleccionar si escribir rutas completas en etiquetas o no.",
  "Date format": "Formato de fecha",
  "Date format for ${date} variable. E.g. \n                  | MMMM Do YYYY, h:mm:ss a (March 20th 2024, 10:54:46 am) \n                  | dddd  (Wednesday)\n                  | MMM Do YY  (Mar 20th 24)":
    "Formato de fecha para la variable ${date}. Ej. :\n                  | MMMM Do YYYY, h:mm:ss a (20 de marzo 2024, 10:54:46) \n                  | dddd  (miércoles)\n                  | MMM Do YY  (mar 20 24)",
  "Folder to save new attachments": "Carpeta para guardar nuevos adjuntos",
  "Select where all new attachments will be saved.\nYou can use templates e.g. _resouces/${date}/${notename}":
    "Seleccionar dónde se guardarán todos los nuevos adjuntos.\nPuede usar plantillas ej. _resources/${date}/${notename}",
  "Move/delete/rename media folder":
    "Mover/eliminar/renombrar carpeta multimedia",
  "Rename or move this folder to the obsidian or system garbage can when the associated note is deleted/renamed/moved. \n                  This setting takes effect only if the path contains ${notename} template at the end\n                  and the options 'Next to note in the folder specified below' / 'Relative to note' are selected.\n                  Use this setting at your own risk.":
    "Renombrar o mover esta carpeta a la papelera de Obsidian o del sistema cuando la nota asociada se elimina/renombra/mueve. \n                  Este ajuste surte efecto solo si la ruta contiene la plantilla ${notename} al final\n                  y las opciones 'Junto a la nota en la carpeta especificada abajo' / 'Relativo a la nota' están seleccionadas.\n                  Use este ajuste bajo su propio riesgo.",
  "Media folder": "Carpeta multimedia",
  "Folder to keep all downloaded media files.":
    "Carpeta para mantener todos los archivos multimedia descargados.",
  Debug: "Depuración",
  "Enable debug output to console.":
    "Habilitar salida de depuración a consola.",
  "Interface settings": "Configuración de interfaz",
  "Processing settings": "Configuración de procesamiento",
  "Note settings": "Configuración de notas",
  "Orphaned attachments": "Adjuntos huérfanos",
  "Media folder settings": "Configuración de carpeta multimedia",
  Troubleshooting: "Resolución de problemas",
  "The value should be a positive integer number between 5 and 3600!":
    "El valor debe ser un número entero positivo entre 5 y 3600!",
  "The value should be a positive integer number between 1 and 6!":
    "El valor debe ser un número entero positivo entre 1 y 6!",
  "File name template cannot contain path separators. Use 'Folder to save new attachments' to set subfolders.":
    "La plantilla de nombre de archivo no puede contener separadores de ruta. Use 'Carpeta para guardar nuevos adjuntos' para establecer subcarpetas.",
  "The value should be a positive integer number between 10 and 100!":
    "El valor debe ser un número entero positivo entre 10 y 100!",
  "The value should be a positive integer!":
    "El valor debe ser un número entero positivo!",
  "Unsafe regex! https://www.npmjs.com/package/safe-regex":
    "¡Regex inseguro! https://www.npmjs.com/package/safe-regex",
  "Unsafe folder name! Some chars are forbidden in some filesystems.":
    "¡Nombre de carpeta inseguro! Algunos caracteres están prohibidos en algunos sistemas de archivos.",
  WebP: "WebP",
  JPEG: "JPEG",
  "Full path": "Ruta completa",
  "Relative to note": "Relativo a la nota",
  "Only filename": "Solo nombre de archivo",
  "Copy Obsidian settings": "Copiar configuración Obsidian",
  "In the root folder specified below": "En la carpeta raíz especificada abajo",
  "Next to note in the folder specified below":
    "Junto a la nota en la carpeta especificada abajo",

  "Cannot copy/download an attachment! Try to add referer in frontmatter 'source' field.": "¡No se puede copiar/descargar el adjunto! Intente agregar referer en el campo 'source' del frontmatter.",

  "{p} file(s) {p}": "{p} archivo(s) {p}",

  "{p} attachments for note {p}": "{p} adjuntos para la nota {p}",


  "Frontmatter of '{p}' skipped (parse error)": "Se omitió el frontmatter de '{p}' (error de análisis)",

  "You obsidian media folder set to {p}, and has been created by the plugin. Please, try again.": "Tu carpeta multimedia de Obsidian está establecida en {p} y fue creada por el plugin. Por favor, inténtalo de nuevo.",

  "You obsidian media folder set to {p}, and has been changed to {p}. Please, note that the plugin settings might need to be updated.": "La carpeta multimedia de Obsidian establecida en {p} ha cambiado a {p}. Es posible que sea necesario actualizar la configuración del plugin.",

  "Attachment folder was renamed to {p}": "La carpeta de adjuntos fue renombrada a {p}",

  "Attachment folder {p} was moved to trash can.": "La carpeta de adjuntos {p} fue movida a la papelera.",

  "Attachments for '{p}' were processed.": "Los adjuntos para '{p}' fueron procesados.",

  "Cannot get current note! ": "¡No se puede obtener la nota actual! ",

  "Cannot get current note/canvas!": "¡No se puede obtener la nota/canvas actual!",

  "Cannot move attachment folder: \r\n{p}": "No se puede mover la carpeta de adjuntos: \r\n{p}",

  "Cannot rename.": "No se puede renombrar.",

  "Image downloaded and linked in '{p}'.": "Imagen descargada y vinculada en '{p}'.",

  "Media links were found, processing...": "Se encontraron enlaces multimedia, procesando...",

  "No orphaned files found!": "¡No se encontraron archivos huérfanos!",

  "Page '{p}' has been processed, but nothing was changed.": "La página '{p}' ha sido procesada, pero no cambió nada.",

  "Please select a note or click inside selected note in canvas.": "Por favor, seleccione una nota o haga clic dentro de la nota seleccionada en canvas.",

  "Please, select a note or click inside a note in canvas!": "¡Por favor, seleccione una nota o haga clic dentro de una nota en canvas!",

  "Remote image not found in '{p}' or it is already local.": "Imagen remota no encontrada en '{p}' o ya es local.",

  "Single image download failed: {p}": "Falló la descarga de una imagen: {p}",

  "The attachment folder {p} does not exist!": "¡La carpeta de adjuntos {p} no existe!",

  "The note was renamed to {p}": "La nota fue renombrada a {p}",

  "This command cannot run on vault's root or on subfolder next to note!\nPlease, change settings first!\r\n": "¡Este comando no puede ejecutarse en la raíz del vault o en una subcarpeta junto a la nota!\n¡Por favor, cambie la configuración primero!\r\n",

  "This command requires the settings 'Next to note in the folder specified below' and pattern '${notename}' at the end to be enabled, also the path cannot contain ${date} pattern.\nPlease, change settings first!\r\n": "Este comando requiere la configuración 'Junto a la nota en la carpeta especificada abajo' y el patrón '${notename}' al final habilitado, además la ruta no puede contener el patrón ${date}.\n¡Por favor, cambie la configuración primero!\r\n",

  "WARNING!\r\nAttachments for \'{p}\' were processed, but some attachments were not downloaded/replaced...": "¡ADVERTENCIA!\r\nLos adjuntos para \'{p}\' fueron procesados, pero algunos adjuntos no fueron descargados/reemplazados...",

  "{p} attachments for note {p} were processed.": "{p} adjuntos para la nota {p} fueron procesados.",
};