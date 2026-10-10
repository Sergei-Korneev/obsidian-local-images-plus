export default {
  "Show notifications": "Показывать уведомления",
  "Show notifications when pages were processed.":
    "Показывать уведомления при обработке страниц.",
  "Context menu: download single image":
    "Контекстное меню: скачать отдельное изображение",
  "Show 'Download this image' when right-clicking a remote image in Live Preview. Downloads only that image and replaces its link.":
    "Показывать 'Скачать это изображение' при правой кнопке мыши на удалённом изображении в режиме Live Preview. Скачивает только это изображение и заменяет его ссылку.",
  "Disable additional commands": "Отключить дополнительные команды",
  "Do not show additional commands in command palette. Reload the plugin in settings to take effect (turn off/on).":
    "Не показывать дополнительные команды в палитре команд. Перезагрузите плагин в настройках для вступления в силу (выкл/вкл).",
  "Automatic processing": "Автоматическая обработка",
  "Process notes on create/copy/paste.":
    "Обрабатывать заметки при создании/копировании/вставке.",
  "Process images in frontmatter": "Обрабатывать изображения во frontmatter",
  "Download and localize image links in the YAML frontmatter. When disabled the frontmatter block is left untouched ('source' key is still used as referer for body images).":
    "Скачивать и локализовывать ссылки на изображения в YAML frontmatter. При отключении блок frontmatter остается нетронутым (ключ 'source' всё ещё используется как реферер для изображений в теле заметки).",
  "Automatic processing interval": "Интервал автоматической обработки",
  "Interval in seconds for processing update. It takes some time to reveal changed content of a note to plugins.":
    "Интервал в секундах для обновления обработки. Требуется время, чтобы изменённое содержимое заметки стало доступно плагинам.",
  "Number of retries for every single attachment":
    "Количество попыток для каждого вложения",
  "If an error occurs during downloading (network etc.) try to re-download several times.":
    "Если происходит ошибка при скачивании (сеть и т.д.), попытаться скачать снова несколько раз.",
  "Process all new markdown files": "Обрабатывать все новые markdown-файлы",
  "Process all new created/cloud-synced files with corresponding extensions.":
    "Обрабатывать все новые созданные/синхронизированные из облака файлы с соответствующими расширениями.",
  "Process all new attachments": "Обрабатывать все новые вложения",
  "The plugin will also move all attachments from obsidian default folder to plugin folder.":
    "Плагин также переместит все вложения из папки Obsidian по умолчанию в папку плагина.",
  "File name template": "Шаблон имени файла",
  "Template for new attachment names. Variables: ${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}. Default: ${md5}_MD5 (backward compatible). Examples: ${originalname}, ${notename}-${originalname}, ${date}-${md5:8}. Use 'Folder to save new attachments' for subfolders.":
    "Шаблон для имён новых вложений. Переменные: ${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}. По умолчанию: ${md5}_MD5 (обратная совместимость). Примеры: ${originalname}, ${notename}-${originalname}, ${date}-${md5:8}. Используйте 'Папка для сохранения новых вложений' для подпапок.",
  "Use markdown link format with angle brackets ![](<link>)":
    "Использовать формат markdown-ссылки с угловыми скобками ![](<link>)",
  "Force using markdown link format with angle brackets instead of encoded URI when generating links.":
    "Принудительно использовать формат markdown-ссылки с угловыми скобками вместо закодированного URI при генерации ссылок.",
  "Process Canvas files": "Обрабатывать файлы Canvas",
  "Process images in Obsidian Canvas (.canvas files)":
    "Обрабатывать изображения в Obsidian Canvas (.canvas файлы)",
  "URL exclude regexps": "Регулярные выражения для исключения URL",
  "One per line: regexps to exclude URLs when downloading. Examples:\n^https://example\\.com/.*\n.*ads\\..*":
    "Одна строка - одно регулярное выражение. Примеры:\n^https://example\\.com/.*\n.*ads\\..*",
  "Download unknown filetypes": "Скачивать неизвестные типы файлов",
  "Download unknown filetypes and save them with .unknown extension.":
    "Скачивать неизвестные типы файлов и сохранять их с расширением .unknown.",
  "Compress images (Web Images)": "Сжимать изображения (Веб-изображения)",
  "Compress all downloaded images. May reduce file size by several times, but can also affect performance.":
    "Сжимать все скачанные изображения. Может уменьшить размер файла в несколько раз, но также может повлиять на производительность.",
  "Compress images (Pasted Images)":
    "Сжимать изображения (Вставленные изображения)",
  "Compress all pasted images. May reduce file size by several times, but can also affect performance.":
    "Сжимать все вставленные изображения. Может уменьшить размер файла в несколько раз, но также может повлиять на производительность.",
  "Compression type": "Тип сжатия",
  "Select image compression type. Keep in mind that webp format has image size limitations.":
    "Выберите тип сжатия изображений. Имейте в виду, что формат webp имеет ограничения по размеру изображения.",
  "Excluded folders": "Исключённые папки",
  "Excluded folders. New files in these folders will not be processed automatically.":
    "Исключённые папки. Новые файлы в этих папках не будут обрабатываться автоматически.",
  "Image Quality": "Качество изображения",
  "Image quality selection (30 to 100).":
    "Выбор качества изображения (от 30 до 100).",
  "File size lower limit in Kb": "Нижний предел размера файла в Кб",
  "Do not download files with size less than this value. Set 0 for no limit.":
    "Не скачивать файлы с размером меньше этого значения. Установите 0 для отсутствия лимита.",
  Exclusions: "Исключения",
  "The plugin will not download attachments with these extensions.":
    "Плагин не будет скачивать вложения с этими расширениями.",
  "Do not create Obsidian attachment folder (For compatibility with other plugins)":
    "Не создавать папку вложений Obsidian (Для совместимости с другими плагинами)",
  "The plugin will not create an Obsidian attachments folder. This may cause the plugin to behave incorrectly. ":
    "Плагин не будет создавать папку вложений Obsidian. Это может привести к некорректной работе плагина.",
  "Preserve link captions": "Сохранять подписи ссылок",
  "Add media links captions to converted tags.":
    "Добавлять подписи медиа-ссылок к преобразованным тегам.",
  "Include pattern": "Шаблон включения",
  "Include only files with extensions only matching this pattern. Example: md|canvas":
    "Включать только файлы с расширениями, соответствующими этому шаблону. Пример: md|canvas",
  "Remove files completely": "Удалять файлы полностью",
  "Do not move orphaned files into the garbage can.":
    "Не перемещать осиротевшие файлы в корзину.",
  "How to write paths in tags": "Как писать пути в тегах",
  "Select whether to write full paths in tags or not.":
    "Выберите, писать ли полные пути в тегах или нет.",
  "Date format": "Формат даты",
  "Date format for ${date} variable. E.g. \n                  | MMMM Do YYYY, h:mm:ss a (March 20th 2024, 10:54:46 am) \n                  | dddd  (Wednesday)\n                  | MMM Do YY  (Mar 20th 24)":
    "Формат даты для переменной ${date}. Например:\n                  | MMMM Do YYYY, h:mm:ss a (20 марта 2024, 10:54:46) \n                  | dddd  (среда)\n                  | MMM Do YY  (мар 20 24)",
  "Folder to save new attachments": "Папка для сохранения новых вложений",
  "Select where all new attachments will be saved.\nYou can use templates e.g. _resouces/${date}/${notename}":
    "Выберите, куда будут сохраняться все новые вложения.\nМожно использовать шаблоны, например _resources/${date}/${notename}",
  "Move/delete/rename media folder":
    "Перемещать/удалять/переименовывать медиа-папку",
  "Rename or move this folder to the obsidian or system garbage can when the associated note is deleted/renamed/moved. \n                  This setting takes effect only if the path contains ${notename} template at the end\n                  and the options 'Next to note in the folder specified below' / 'Relative to note' are selected.\n                  Use this setting at your own risk.":
    "Переименовать или переместить эту папку в корзину Obsidian или систему при удалении/переименовании/перемещении связанной заметки. \n                  Эта настройка работает только если путь содержит шаблон ${notename} в конце\n                  и выбраны опции 'Рядом с заметкой в указанной ниже папке' / 'Относительно заметки'.\n                  Используйте на свой страх и риск.",
  "Media folder": "Медиа-папка",
  "Folder to keep all downloaded media files.":
    "Папка для хранения всех скачанных медиа-файлов.",
  Debug: "Отладка",
  "Enable debug output to console.":
    "Включить вывод отладочной информации в консоль.",
  "Interface settings": "Настройки интерфейса",
  "Processing settings": "Настройки обработки",
  "Note settings": "Настройки заметок",
  "Orphaned attachments": "Осиротевшие вложения",
  "Media folder settings": "Настройки медиа-папки",
  Troubleshooting: "Устранение неполадок",
  "The value should be a positive integer number between 5 and 3600!":
    "Значение должно быть положительным целым числом от 5 до 3600!",
  "The value should be a positive integer number between 1 and 6!":
    "Значение должно быть положительным целым числом от 1 до 6!",
  "File name template cannot contain path separators. Use 'Folder to save new attachments' to set subfolders.":
    "Шаблон имени файла не может содержать разделители путей. Используйте 'Папку для сохранения новых вложений' для установки подпапок.",
  "The value should be a positive integer number between 10 and 100!":
    "Значение должно быть положительным целым числом от 10 до 100!",
  "The value should be a positive integer!":
    "Значение должно быть положительным целым числом!",
  "Unsafe regex! https://www.npmjs.com/package/safe-regex":
    "Небезопасное регулярное выражение! https://www.npmjs.com/package/safe-regex",
  "Unsafe folder name! Some chars are forbidden in some filesystems.":
    "Небезопасное имя папки! Некоторые символы запрещены в некоторых файловых системах.",
  WebP: "WebP",
  JPEG: "JPEG",
  "Full path": "Полный путь",
  "Relative to note": "Относительно заметки",
  "Only filename": "Только имя файла",
  "Copy Obsidian settings": "Копировать настройки Obsidian",
  "In the root folder specified below": "В корневую папку, указанную ниже",
  "Next to note in the folder specified below":
    "Рядом с заметкой в папке, указанной ниже",

  "Cannot copy/download an attachment! Try to add referer in frontmatter 'source' field.": "Невозможно скопировать/загрузить вложение! Попробуйте добавить referer в frontmatter поле 'source'.",

  "Attachments for '{p}' were processed.": "Вложения для '{p}' обработаны.",

  "WARNING!\r\nAttachments for '{p}' were processed, but some attachments were not downloaded/replaced...": "ВНИМАНИЕ!\r\nВложения для '{p}' обработаны, но некоторые вложения не были загружены/заменены...",

  "Page '{p}' has been processed, but nothing was changed.": "Страница '{p}' обработана, но ничего не изменилось.",

  "Cannot get current note/canvas!": "Не удалось получить текущую заметку/холст!",

  "The note/canvas file is not found! Try to save the file before running the command.": "Файл заметки/холста не найден! Попробуйте сохранить файл перед выполнением команды.",

  "Media links were found, processing...": "Найдены медиа-ссылки, обрабатываю...",

  "There were errors while processing files. Please, check the console for more details.": "Во время обработки файлов возникли ошибки. Проверьте консоль для получения подробной информации.",

  "All files have been processed successfully. Let's check for orphaned files! (command: Find orphaned attachments)": "Все файлы успешно обработаны. Давайте проверим неиспользуемые вложения! (команда: Найти неиспользуемые вложения)",

  "All attachments have been processed successfully.": "Все вложения успешно обработаны.",

  "There were errors while processing some attachments. Please, check the console for more details.": "При обработке некоторых вложений возникли ошибки. Проверьте консоль для получения подробной информации.",

  "No orphaned files found!": "Неиспользуемые файлы не найдены!",

  "There were errors while finding orphaned files. Please, check the console for more details.": "При поиске неиспользуемых файлов возникли ошибки. Проверьте консоль для получения подробной информации.",

  "Orphaned files were found. Check and remove them via the command: Find orphaned attachments": "Найдены неиспользуемые файлы. Проверьте и удалите их с помощью команды: Найти неиспользуемые вложения",

  "{p} file(s) {p}": "{p} файл(ов) {p}",

  "There were errors while removing orphaned files. Please, check the console for more details.": "При удалении неиспользуемых файлов возникли ошибки. Проверьте консоль для получения подробной информации.",

  "Attachment folder name has been changed. Renaming notes is recommended (command: Rename notes in the current folder)!": "Имя папки вложений изменено. Рекомендуется переименовать заметки (команда: Переименовать заметки в текущей папке)!",

  "The note was renamed to {p}": "Заметка переименована в {p}",

  "Cannot rename.": "Невозможно переименовать.",

  "Attachment folder was renamed to {p}": "Папка вложений переименована в {p}",

  "Attachment folder {p} was moved to trash can.": "Папка вложений {p} перемещена в корзину.",

  "Cannot get current note! ": "Не удалось получить текущую заметку! ",

  "Cannot move attachment folder: \r\n{p}": "Не удалось переместить папку вложений: \r\n{p}",

  "Frontmatter of '{p}' skipped (parse error)": "Frontmatter '{p}' пропущен (ошибка парсинга)",

  "Image downloaded and linked in '{p}'.": "Изображение загружено и связано в '{p}'.",

  "Please select a note or click inside selected note in canvas.": "Пожалуйста, выберите заметку или кликните внутри выбранной заметки в canvas.",

  "Please, select a note or click inside a note in canvas!": "Пожалуйста, выберите заметку или кликните внутри заметки в canvas!",

  "Remote image not found in '{p}' or it is already local.": "Удаленное изображение не найдено в '{p}' или оно уже локально.",

  "Single image download failed: {p}": "Не удалось загрузить изображение: {p}",

  "The attachment folder {p} does not exist!": "Папка вложений {p} не существует!",

  "This command cannot run on vault's root or on subfolder next to note!\nPlease, change settings first!\r\n": "Эта команда не может выполняться в корне хранилища или в подпапке рядом с заметкой!\nПожалуйста, сначала измените настройки!\r\n",

  "This command requires the settings 'Next to note in the folder specified below' and pattern '${notename}' at the end to be enabled, also the path cannot contain ${date} pattern.\nPlease, change settings first!\r\n": "Эта команда требует настройки 'Рядом с заметкой в папке, указанной ниже' и шаблона '${notename}' в конце, также путь не может содержать шаблон ${date}.\nПожалуйста, сначала измените настройки!\r\n",

  "You obsidian media folder set to {p}, and has been created by the plugin. Please, try again.": "Ваша папка медиа Obsidian установлена на {p} и создана плагином. Пожалуйста, попробуйте снова.",

  "{p} attachments for note {p} were processed.": "{p} вложений для заметки {p} обработано.",
};