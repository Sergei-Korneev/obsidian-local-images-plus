export default {
  "Show notifications": "Показувати сповіщення",
  "Show notifications when pages were processed.":
    "Показувати сповіщення, коли сторінки були оброблені.",
  "Context menu: download single image":
    "Контекстне меню: завантажити окреме зображення",
  "Show 'Download this image' when right-clicking a remote image in Live Preview. Downloads only that image and replaces its link.":
    "Показувати 'Завантажити це зображення' при правий кнопці миші на віддаленому зображенні в Live Preview. Завантажує тільки це зображення і замінює його посилання.",
  "Disable additional commands": "Вимкнути додаткові команди",
  "Do not show additional commands in command palette. Reload the plugin in settings to take effect (turn off/on).":
    "Не показувати додаткові команди в палітрі команд. Перезавантажте плагін у налаштуваннях для вступу в силу (вимк/увмк).",
  "Automatic processing": "Автоматична обробка",
  "Process notes on create/copy/paste.":
    "Обробляти нотатки при створенні/копіюванні/вставці.",
  "Process images in frontmatter": "Обробляти зображення у frontmatter",
  "Download and localize image links in the YAML frontmatter. When disabled the frontmatter block is left untouched ('source' key is still used as referer for body images).":
    "Завантажувати та локалізувати посилання на зображення в YAML frontmatter. Коли вимкнено, блок frontmatter залишається незмінним (ключ 'source' все ще використовується як реферер для зображень у тілі).",
  "Automatic processing interval": "Інтервал автоматичної обробки",
  "Interval in seconds for processing update. It takes some time to reveal changed content of a note to plugins.":
    "Інтервал у секундах для оновлення обробки. Потрібен час, щоб змінений вміст нотатки став доступним для плагінів.",
  "Number of retries for every single attachment":
    "Кількість спроб для кожного вкладення",
  "If an error occurs during downloading (network etc.) try to re-download several times.":
    "Якщо виникає помилка під час завантаження (мережа тощо), спробувати завантажити знову кілька разів.",
  "Process all new markdown files": "Обробляти всі нові markdown-файли",
  "Process all new created/cloud-synced files with corresponding extensions.":
    "Обробляти всі нові створені/хмарно-синхронізовані файли з відповідними розширеннями.",
  "Process all new attachments": "Обробляти всі нові вкладення",
  "The plugin will also move all attachments from obsidian default folder to plugin folder.":
    "Плагін також перемістить всі вкладення з папки Obsidian за замовчуванням у папку плагіна.",
  "File name template": "Шаблон імені файлу",
  "Template for new attachment names. Variables: ${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}. Default: ${md5}_MD5 (backward compatible). Examples: ${originalname}, ${notename}-${originalname}, ${date}-${md5:8}. Use 'Folder to save new attachments' for subfolders.":
    "Шаблон для імен нових вкладень. Змінні: ${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}. За замовчуванням: ${md5}_MD5 (сумісність з попередніми версіями). Приклади: ${originalname}, ${notename}-${originalname}, ${date}-${md5:8}. Використовуйте 'Папка для збереження нових вкладень' для підпапок.",
  "Use markdown link format with angle brackets ![](<link>)":
    "Використовувати формат markdown-посилання з кутовими дужками ![](<link>)",
  "Force using markdown link format with angle brackets instead of encoded URI when generating links.":
    "Примусово використовувати формат markdown-посилання з кутовими дужками замість закодованого URI при генерації посилань.",
  "Process Canvas files": "Обробляти файли Canvas",
  "Process images in Obsidian Canvas (.canvas files)":
    "Обробляти зображення в Obsidian Canvas (.canvas файли)",
  "URL exclude regexps": "Регулярні вирази для виключення URL",
  "One per line: regexps to exclude URLs when downloading. Examples:\n^https://example\\.com/.*\n.*ads\\..*":
    "Один на рядок: регулярні вирази для виключення URL при завантаженні. Приклади:\n^https://example\\.com/.*\n.*ads\\..*",
  "Download unknown filetypes": "Завантажувати невідомі типи файлів",
  "Download unknown filetypes and save them with .unknown extension.":
    "Завантажувати невідомі типи файлів і зберігати їх з розширенням .unknown.",
  "Compress images (Web Images)": "Стискати зображення (Веб-зображення)",
  "Compress all downloaded images. May reduce file size by several times, but can also affect performance.":
    "Стискати всі завантажені зображення. Може зменшити розмір файлу в декілька разів, але також може вплинути на продуктивність.",
  "Compress images (Pasted Images)":
    "Стискати зображення (Вставлені зображення)",
  "Compress all pasted images. May reduce file size by several times, but can also affect performance.":
    "Стискати всі вставлені зображення. Може зменшити розмір файлу в декілька разів, але також може вплинути на продуктивність.",
  "Compression type": "Тип стиснення",
  "Select image compression type. Keep in mind that webp format has image size limitations.":
    "Виберіть тип стиснення зображення. Пам'ятайте, що формат webp має обмеження розміру зображення.",
  "Excluded folders": "Виключені папки",
  "Excluded folders. New files in these folders will not be processed automatically.":
    "Виключені папки. Нові файли у цих папках не будуть оброблятися автоматично.",
  "Image Quality": "Якість зображення",
  "Image quality selection (30 to 100).":
    "Вибір якості зображення (від 30 до 100).",
  "File size lower limit in Kb": "Нижня межа розміру файлу в Кб",
  "Do not download files with size less than this value. Set 0 for no limit.":
    "Не завантажувати файли з розміром менше цього значення. Встановіть 0 для відсутності ліміту.",
  Exclusions: "Виключення",
  "The plugin will not download attachments with these extensions.":
    "Плагін не буде завантажувати вкладення з цими розширеннями.",
  "Do not create Obsidian attachment folder (For compatibility with other plugins)":
    "Не створювати папку вкладень Obsidian (Для сумісності з іншими плагінами)",
  "The plugin will not create an Obsidian attachments folder. This may cause the plugin to behave incorrectly. ":
    "Плагін не створить папку вкладень Obsidian. Це може призвести до неправильної роботи плагіна.",
  "Preserve link captions": "Зберегти підписи посилань",
  "Add media links captions to converted tags.":
    "Додати підписи медіа-посилань до конвертованих тегів.",
  "Include pattern": "Шаблон включення",
  "Include only files with extensions only matching this pattern. Example: md|canvas":
    "Включати лише файли з розширеннями, що відповідають цьому шаблону. Приклад: md|canvas",
  "Remove files completely": "Видалити файли повністю",
  "Do not move orphaned files into the garbage can.":
    "Не переміщувати сиротські файли у смітник.",
  "How to write paths in tags": "Як записувати шляхи в тегах",
  "Select whether to write full paths in tags or not.":
    "Оберіть, чи записувати повні шляхи в тегах чи ні.",
  "Date format": "Формат дати",
  "Date format for ${date} variable. E.g. \n                  | MMMM Do YYYY, h:mm:ss a (March 20th 2024, 10:54:46 am) \n                  | dddd  (Wednesday)\n                  | MMM Do YY  (Mar 20th 24)":
    "Формат дати для змінної ${date}. Напр. :\n                  | MMMM Do YYYY, h:mm:ss a (20 березня 2024, 10:54:46) \n                  | dddd  (середа)\n                  | MMM Do YY  (берез 20 24)",
  "Folder to save new attachments": "Папка для збереження нових вкладень",
  "Select where all new attachments will be saved.\nYou can use templates e.g. _resouces/${date}/${notename}":
    "Виберіть, де будуть зберігатися всі нові вкладення.\nВи можете використовувати шаблони, напр. _resources/${date}/${notename}",
  "Move/delete/rename media folder":
    "Перемістити/видалити/перейменувати медіа-папку",
  "Rename or move this folder to the obsidian or system garbage can when the associated note is deleted/renamed/moved. \n                  This setting takes effect only if the path contains ${notename} template at the end\n                  and the options 'Next to note in the folder specified below' / 'Relative to note' are selected.\n                  Use this setting at your own risk.":
    "Перейменуйте або перемістіть цю папку в смітник Obsidian або системи, коли пов'язана нотатка видалена/перейменована/переміщена. \n                  Цей параметр діє лише якщо шлях містить шаблон ${notename} в кінці\n                  і обрані опції 'Біля нотатки в вказаній нижче папці' / 'Відносно нотатки'.\n                  Використовуйте на власний ризик.",
  "Media folder": "Медіа-папка",
  "Folder to keep all downloaded media files.":
    "Папка для зберігання всіх завантажених медіа-файлів.",
  Debug: "Налагодження",
  "Enable debug output to console.": "Увімкнути вивід налагодження у консоль.",
  "Interface settings": "Налаштування інтерфейсу",
  "Processing settings": "Налаштування обробки",
  "Note settings": "Налаштування нотаток",
  "Orphaned attachments": "Сиротські вкладення",
  "Media folder settings": "Налаштування медіа-папки",
  Troubleshooting: "Вирішення проблем",
  "The value should be a positive integer number between 5 and 3600!":
    "Значення має бути додатнім цілим числом від 5 до 3600!",
  "The value should be a positive integer number between 1 and 6!":
    "Значення має бути додатнім цілим числом від 1 до 6!",
  "File name template cannot contain path separators. Use 'Folder to save new attachments' to set subfolders.":
    "Шаблон імені файлу не може містити роздільники шляхів. Використовуйте 'Папку для збереження нових вкладень' для встановлення підпапок.",
  "The value should be a positive integer number between 10 and 100!":
    "Значення має бути додатнім цілим числом від 10 до 100!",
  "The value should be a positive integer!":
    "Значення має бути додатнім цілим числом!",
  "Unsafe regex! https://www.npmjs.com/package/safe-regex":
    "Небезпечний регулярний вираз! https://www.npmjs.com/package/safe-regex",
  "Unsafe folder name! Some chars are forbidden in some filesystems.":
    "Небезпечна назва папки! Деякі символи заборонені у деяких файловых системах.",
  WebP: "WebP",
  JPEG: "JPEG",
  "Full path": "Повний шлях",
  "Relative to note": "Відносно нотатки",
  "Only filename": "Тільки ім'я файлу",
  "Copy Obsidian settings": "Копіювати налаштування Obsidian",
  "In the root folder specified below": "У кореневій папці, вказаній нижче",
  "Next to note in the folder specified below":
    "Біля нотатки у вказаній нижче папці",

  "Cannot copy/download an attachment! Try to add referer in frontmatter 'source' field.": "Неможливо скопіювати/завантажити вкладення! Спробуйте додати referer у поле 'source' frontmatter.",

  "{p} file(s) {p}": "{p} файл(ів) {p}",

  "{p} attachments for note {p}": "{p} вкладень для нотатки {p}",


  "Frontmatter of '{p}' skipped (parse error)": "Frontmatter '{p}' пропущено (помилка розбору)",

  "You obsidian media folder set to {p}, and has been created by the plugin. Please, try again.": "Папка медіа Obsidian встановлена як {p} і створена плагіном. Спробуйте ще раз.",

  "You obsidian media folder set to {p}, and has been changed to {p}. Please, note that the plugin settings might need to be updated.": "Папка медіа Obsidian змінена з {p} на {p}. Можливо, потрібно оновити налаштування плагіна.",

  "Attachment folder was renamed to {p}": "Папку вкладень перейменовано на {p}",

  "Attachment folder {p} was moved to trash can.": "Папку вкладень {p} переміщено до кошика.",

  "Attachments for '{p}' were processed.": "Вкладення для '{p}' оброблено.",

  "Cannot get current note! ": "Не вдалося отримати поточну нотатку! ",

  "Cannot get current note/canvas!": "Не вдалося отримати поточну нотатку/canvas!",

  "Cannot move attachment folder: \r\n{p}": "Не вдалося перемістити папку вкладень: \r\n{p}",

  "Cannot rename.": "Неможливо перейменувати.",

  "Image downloaded and linked in '{p}'.": "Зображення завантажено та пов'язано у '{p}'.",

  "Media links were found, processing...": "Знайдено медіа-посилання, обробка...",

  "No orphaned files found!": "Невикористані файли не знайдено!",

  "Page '{p}' has been processed, but nothing was changed.": "Сторінка '{p}' оброблена, але нічого не змінилося.",

  "Please select a note or click inside selected note in canvas.": "Будь ласка, оберіть нотатку або клацніть всередині вибраної нотатки в canvas.",

  "Please, select a note or click inside a note in canvas!": "Будь ласка, оберіть нотатку або клацніть всередині нотатки в canvas!",

  "Remote image not found in '{p}' or it is already local.": "Віддалене зображення не знайдено в '{p}' або воно вже локальне.",

  "Single image download failed: {p}": "Не вдалося завантажити зображення: {p}",

  "The attachment folder {p} does not exist!": "Папка вкладень {p} не існує!",

  "The note was renamed to {p}": "Нотатку перейменовано на {p}",

  "This command cannot run on vault's root or on subfolder next to note!\nPlease, change settings first!\r\n": "Ця команда не може виконуватися в корені сховища або в підпапці поруч з нотаткою!\nБудь ласка, спочатку змініть налаштування!\r\n",

  "This command requires the settings 'Next to note in the folder specified below' and pattern '${notename}' at the end to be enabled, also the path cannot contain ${date} pattern.\nPlease, change settings first!\r\n": "Ця команда вимагає налаштування 'Поруч з нотаткою в папці, вказаній нижче' та шаблону '${notename}' в кінці, також шлях не може містити шаблон ${date}.\nБудь ласка, спочатку змініть налаштування!\r\n",

  "WARNING!\r\nAttachments for \'{p}\' were processed, but some attachments were not downloaded/replaced...": "УВАГА!\r\nВкладення для \'{p}\' оброблено, але деякі вкладення не були завантажені/замінені...",

  "{p} attachments for note {p} were processed.": "{p} вкладень для нотатки {p} оброблено.",
};