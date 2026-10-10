export default {
  "Show notifications": "显示通知",
  "Show notifications when pages were processed.": "页面处理完成时显示通知。",
  "Context menu: download single image": "右键菜单: 下载单张图片",
  "Show 'Download this image' when right-clicking a remote image in Live Preview. Downloads only that image and replaces its link.":
    "在实时预览中右键点击远程图片时显示'下载此图片'。仅下载该图片并替换其链接。",
  "Disable additional commands": "禁用额外命令",
  "Do not show additional commands in command palette. Reload the plugin in settings to take effect (turn off/on).":
    "在命令面板中不显示额外命令。在设置中重新加载插件以生效（关闭/开启）。",
  "Automatic processing": "自动处理",
  "Process notes on create/copy/paste.": "创建/复制/粘贴时处理笔记。",
  "Process images in frontmatter": "处理 Frontmatter 中的图片",
  "Download and localize image links in the YAML frontmatter. When disabled the frontmatter block is left untouched ('source' key is still used as referer for body images).":
    "下载并本地化 YAML frontmatter 中的图片链接。禁用时 frontmatter 块保持不变（'source' 键仍用作正文图片的引用来源）。",
  "Automatic processing interval": "自动处理间隔",
  "Interval in seconds for processing update. It takes some time to reveal changed content of a note to plugins.":
    "处理更新的间隔（秒）。插件需要一些时间来检测笔记的变更内容。",
  "Number of retries for every single attachment": "每个附件的重试次数",
  "If an error occurs during downloading (network etc.) try to re-download several times.":
    "如果下载过程中发生错误（网络等），尝试重新下载多次。",
  "Process all new markdown files": "处理所有新的 Markdown 文件",
  "Process all new created/cloud-synced files with corresponding extensions.":
    "处理所有新建/云同步的、具有对应扩展名的文件。",
  "Process all new attachments": "处理所有新附件",
  "The plugin will also move all attachments from obsidian default folder to plugin folder.":
    "插件也会将所有附件从 Obsidian 默认文件夹移动到插件文件夹。",
  "File name template": "文件名模板",
  "Template for new attachment names. Variables: ${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}. Default: ${md5}_MD5 (backward compatible). Examples: ${originalname}, ${notename}-${originalname}, ${date}-${md5:8}. Use 'Folder to save new attachments' for subfolders.":
    "新附件名称模板。变量：${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}。默认：${md5}_MD5（向后兼容）。示例：${originalname}, ${notename}-${originalname}, ${date}-${md5:8}。使用'保存新附件的文件夹'设置子文件夹。",
  "Use markdown link format with angle brackets ![](<link>)":
    "使用带尖括号的 Markdown 链接格式 ![](<link>)",
  "Force using markdown link format with angle brackets instead of encoded URI when generating links.":
    "生成链接时强制使用带尖括号的 Markdown 链接格式，而不是编码的 URI。",
  "Process Canvas files": "处理 Canvas 文件",
  "Process images in Obsidian Canvas (.canvas files)":
    "处理 Obsidian Canvas (.canvas 文件) 中的图片",
  "URL exclude regexps": "URL 排除正则表达式",
  "One per line: regexps to exclude URLs when downloading. Examples:\n^https://example\\.com/.*\n.*ads\\..*":
    "每行一个：下载时排除 URL 的正则表达式。示例：\n^https://example\\.com/.*\n.*ads\\..*",
  "Download unknown filetypes": "下载未知文件类型",
  "Download unknown filetypes and save them with .unknown extension.":
    "下载未知文件类型并以 .unknown 扩展名保存。",
  "Compress images (Web Images)": "压缩图片 (网络图片)",
  "Compress all downloaded images. May reduce file size by several times, but can also affect performance.":
    "压缩所有下载的图片。可将文件大小减少数倍，但也可能影响性能。",
  "Compress images (Pasted Images)": "压缩图片 (粘贴图片)",
  "Compress all pasted images. May reduce file size by several times, but can also affect performance.":
    "压缩所有粘贴的图片。可将文件大小减少数倍，但也可能影响性能。",
  "Compression type": "压缩类型",
  "Select image compression type. Keep in mind that webp format has image size limitations.":
    "选择图片压缩类型。请注意 WebP 格式有图片尺寸限制。",
  "Excluded folders": "排除文件夹",
  "Excluded folders. New files in these folders will not be processed automatically.":
    "排除文件夹。这些文件夹中的新文件不会被自动处理。",
  "Image Quality": "图片质量",
  "Image quality selection (30 to 100).": "图片质量选择 (30 到 100)。",
  "File size lower limit in Kb": "文件大小下限 (KB)",
  "Do not download files with size less than this value. Set 0 for no limit.":
    "不下载小于此值的文件。设为 0 表示无限制。",
  Exclusions: "排除项",
  "The plugin will not download attachments with these extensions.":
    "插件不会下载这些扩展名的附件。",
  "Do not create Obsidian attachment folder (For compatibility with other plugins)":
    "不创建 Obsidian 附件文件夹（为与其他插件兼容）",
  "The plugin will not create an Obsidian attachments folder. This may cause the plugin to behave incorrectly. ":
    "插件不会创建 Obsidian 附件文件夹。这可能导致插件行为异常。",
  "Preserve link captions": "保留链接标题",
  "Add media links captions to converted tags.":
    "将媒体链接标题添加到转换后的标签。",
  "Include pattern": "包含模式",
  "Include only files with extensions only matching this pattern. Example: md|canvas":
    "仅包含扩展名匹配此模式的文件。示例：md|canvas",
  "Remove files completely": "完全删除文件",
  "Do not move orphaned files into the garbage can.":
    "不将孤立文件移入回收站。",
  "How to write paths in tags": "标签中路径的写法",
  "Select whether to write full paths in tags or not.":
    "选择是否在标签中写入完整路径。",
  "Date format": "日期格式",
  "Date format for ${date} variable. E.g. \n                  | MMMM Do YYYY, h:mm:ss a (March 20th 2024, 10:54:46 am) \n                  | dddd  (Wednesday)\n                  | MMM Do YY  (Mar 20th 24)":
    "${date} 变量的日期格式。例如：\n                  | MMMM Do YYYY, h:mm:ss a (2024年3月20日, 10:54:46) \n                  | dddd  (星期三)\n                  | MMM Do YY  (3月 20 24)",
  "Folder to save new attachments": "保存新附件的文件夹",
  "Select where all new attachments will be saved.\nYou can use templates e.g. _resouces/${date}/${notename}":
    "选择所有新附件的保存位置。\n可使用模板，如 _resources/${date}/${notename}",
  "Move/delete/rename media folder": "移动/删除/重命名媒体文件夹",
  "Rename or move this folder to the obsidian or system garbage can when the associated note is deleted/renamed/moved. \n                  This setting takes effect only if the path contains ${notename} template at the end\n                  and the options 'Next to note in the folder specified below' / 'Relative to note' are selected.\n                  Use this setting at your own risk.":
    "当关联笔记被删除/重命名/移动时，重命名或移动此文件夹到 Obsidian 或系统回收站。\n                  此设置仅在路径以 ${notename} 模板结尾\n                  且选中'下方指定文件夹中紧邻笔记' / '相对于笔记'选项时生效。\n                  自担风险使用。",
  "Media folder": "媒体文件夹",
  "Folder to keep all downloaded media files.":
    "保存所有下载媒体文件的文件夹。",
  Debug: "调试",
  "Enable debug output to console.": "启用控制台调试输出。",
  "Interface settings": "界面设置",
  "Processing settings": "处理设置",
  "Note settings": "笔记设置",
  "Orphaned attachments": "孤立附件",
  "Media folder settings": "媒体文件夹设置",
  Troubleshooting: "故障排除",
  "The value should be a positive integer number between 5 and 3600!":
    "值必须是 5 到 3600 之间的正整数！",
  "The value should be a positive integer number between 1 and 6!":
    "值必须是 1 到 6 之间的正整数！",
  "File name template cannot contain path separators. Use 'Folder to save new attachments' to set subfolders.":
    "文件名模板不能包含路径分隔符。使用'保存新附件的文件夹'设置子文件夹。",
  "The value should be a positive integer number between 10 and 100!":
    "值必须是 10 到 100 之间的正整数！",
  "The value should be a positive integer!": "值必须是正整数！",
  "Unsafe regex! https://www.npmjs.com/package/safe-regex":
    "不安全的正则表达式！ https://www.npmjs.com/package/safe-regex",
  "Unsafe folder name! Some chars are forbidden in some filesystems.":
    "不安全的文件夹名称！某些字符在某些文件系统中被禁止。",
  WebP: "WebP",
  JPEG: "JPEG",
  "Full path": "完整路径",
  "Relative to note": "相对于笔记",
  "Only filename": "仅文件名",
  "Copy Obsidian settings": "复制 Obsidian 设置",
  "In the root folder specified below": "在下方指定的根文件夹中",
  "Next to note in the folder specified below": "在下方指定文件夹中紧邻笔记",

  "Cannot copy/download an attachment! Try to add referer in frontmatter 'source' field.": "无法复制/下载附件！请尝试在 frontmatter 的 'source' 字段中添加 referer。",

  "{p} file(s) {p}": "{p} 个文件 {p}",

  "{p} attachments for note {p}": "笔记 {p} 的附件 {p}",


  "Frontmatter of '{p}' skipped (parse error)": "已跳过 '{p}' 的 frontmatter（解析错误）",

  "You obsidian media folder set to {p}, and has been created by the plugin. Please, try again.": "Obsidian 媒体文件夹已设置为 {p} 并由插件创建。请重试。",

  "You obsidian media folder set to {p}, and has been changed to {p}. Please, note that the plugin settings might need to be updated.": "Obsidian 媒体文件夹已从 {p} 更改为 {p}。可能需要更新插件设置。",

  "Attachment folder was renamed to {p}": "附件文件夹已重命名为 {p}",

  "Attachment folder {p} was moved to trash can.": "附件文件夹 {p} 已移至废纸篓。",

  "Attachments for '{p}' were processed.": "已处理 '{p}' 的附件。",

  "Cannot get current note! ": "无法获取当前笔记! ",

  "Cannot get current note/canvas!": "无法获取当前笔记/canvas!",

  "Cannot move attachment folder: \r\n{p}": "无法移动附件文件夹: \r\n{p}",

  "Cannot rename.": "无法重命名。",

  "Image downloaded and linked in '{p}'.": "图片已下载并在 '{p}' 中链接。",

  "Media links were found, processing...": "找到媒体链接，正在处理...",

  "No orphaned files found!": "未找到孤立文件!",

  "Page '{p}' has been processed, but nothing was changed.": "页面 '{p}' 已处理，但无变化。",

  "Please select a note or click inside selected note in canvas.": "请选择一条笔记或在画布中点击选中的笔记。",

  "Please, select a note or click inside a note in canvas!": "请选择一条笔记或在画布中点击笔记!",

  "Remote image not found in '{p}' or it is already local.": "在 '{p}' 中未找到远程图片或其已为本地图片。",

  "Single image download failed: {p}": "单张图片下载失败: {p}",

  "The attachment folder {p} does not exist!": "附件文件夹 {p} 不存在!",

  "The note was renamed to {p}": "笔记已重命名为 {p}",

  "This command cannot run on vault's root or on subfolder next to note!\nPlease, change settings first!\r\n": "此命令无法在 vault 根目录或笔记旁的子文件夹中运行!\n请先更改设置!\r\n",

  "This command requires the settings 'Next to note in the folder specified below' and pattern '${notename}' at the end to be enabled, also the path cannot contain ${date} pattern.\nPlease, change settings first!\r\n": "此命令需要启用设置 '下方指定文件夹中的笔记旁' 和末尾的 '${notename}' 模式，路径也不能包含 ${date} 模式。\n请先更改设置!\r\n",

  "WARNING!\r\nAttachments for \'{p}\' were processed, but some attachments were not downloaded/replaced...": "警告!\r\n已处理 \'{p}\' 的附件，但某些附件未下载/替换...",

  "{p} attachments for note {p} were processed.": "已处理笔记 {p} 的 {p} 个附件。",
};