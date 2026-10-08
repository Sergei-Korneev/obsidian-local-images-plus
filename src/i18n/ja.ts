export default {
  "Show notifications": "通知を表示",
  "Show notifications when pages were processed.":
    "ページが処理されたときに通知を表示します。",
  "Context menu: download single image":
    "コンテキストメニュー: 単一画像をダウンロード",
  "Show 'Download this image' when right-clicking a remote image in Live Preview. Downloads only that image and replaces its link.":
    "ライブプレビューでリモート画像を右クリックしたときに「この画像をダウンロード」を表示します。その画像のみをダウンロードし、リンクを置き換えます。",
  "Disable additional commands": "追加コマンドを無効化",
  "Do not show additional commands in command palette. Reload the plugin in settings to take effect (turn off/on).":
    "コマンドパレットに追加コマンドを表示しません。設定でプラグインをリロードして有効にしてください（オフ/オン）。",
  "Automatic processing": "自動処理",
  "Process notes on create/copy/paste.":
    "ノートの作成/コピー/貼り付け時に処理します。",
  "Process images in frontmatter": "フロントマターの画像を処理",
  "Download and localize image links in the YAML frontmatter. When disabled the frontmatter block is left untouched ('source' key is still used as referer for body images).":
    "YAMLフロントマター内の画像リンクをダウンロードしてローカル化します。無効にするとフロントマターブロックはそのままになります（「source」キーは本文画像のリファラーとして使用されます）。",
  "Automatic processing interval": "自動処理間隔",
  "Interval in seconds for processing update. It takes some time to reveal changed content of a note to plugins.":
    "処理更新の間隔（秒）。プラグインに変更されたノートの内容が反映されるまで時間がかかります。",
  "Number of retries for every single attachment":
    "各添付ファイルのリトライ回数",
  "If an error occurs during downloading (network etc.) try to re-download several times.":
    "ダウンロード中にエラーが発生した場合（ネットワークなど）、再ダウンロードを複数回試みます。",
  "Process all new markdown files": "すべての新しいMarkdownファイルを処理",
  "Process all new created/cloud-synced files with corresponding extensions.":
    "対応する拡張子を持つすべての新規作成/クラウド同期ファイルを処理します。",
  "Process all new attachments": "すべての新しい添付ファイルを処理",
  "The plugin will also move all attachments from obsidian default folder to plugin folder.":
    "プラグインはObsidianのデフォルトフォルダからプラグインフォルダへすべての添付ファイルを移動します。",
  "File name template": "ファイル名テンプレート",
  "Template for new attachment names. Variables: ${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}. Default: ${md5}_MD5 (backward compatible). Examples: ${originalname}, ${notename}-${originalname}, ${date}-${md5:8}. Use 'Folder to save new attachments' for subfolders.":
    "新しい添付ファイル名のテンプレート。変数: ${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}. デフォルト: ${md5}_MD5 (下位互換)。例: ${originalname}, ${notename}-${originalname}, ${date}-${md5:8}. 「新しい添付ファイルを保存するフォルダ」でサブフォルダを指定。",
  "Use markdown link format with angle brackets ![](<link>)":
    "山括弧付きMarkdownリンク形式を使用 ![](<link>)",
  "Force using markdown link format with angle brackets instead of encoded URI when generating links.":
    "リンク生成時にエンコード済みURIの代わりに山括弧付きMarkdownリンク形式を強制使用します。",
  "Process Canvas files": "Canvasファイルを処理",
  "Process images in Obsidian Canvas (.canvas files)":
    "Obsidian Canvas(.canvasファイル)内の画像を処理",
  "URL exclude regexps": "URL除外正規表現",
  "One per line: regexps to exclude URLs when downloading. Examples:\n^https://example\\.com/.*\n.*ads\\..*":
    "1行に1つ: ダウンロード時に除外するURLの正規表現。例:\n^https://example\\.com/.*\n.*ads\\..*",
  "Download unknown filetypes": "未知のファイルタイプをダウンロード",
  "Download unknown filetypes and save them with .unknown extension.":
    "未知のファイルタイプをダウンロードし、.unknown拡張子で保存します。",
  "Compress images (Web Images)": "画像を圧縮 (Web画像)",
  "Compress all downloaded images. May reduce file size by several times, but can also affect performance.":
    "ダウンロードしたすべての画像を圧縮。ファイルサイズを数倍削減できますが、パフォーマンスに影響する可能性があります。",
  "Compress images (Pasted Images)": "画像を圧縮 (貼り付け画像)",
  "Compress all pasted images. May reduce file size by several times, but can also affect performance.":
    "貼り付けたすべての画像を圧縮。ファイルサイズを数倍削減できますが、パフォーマンスに影響する可能性があります。",
  "Compression type": "圧縮タイプ",
  "Select image compression type. Keep in mind that webp format has image size limitations.":
    "画像圧縮タイプを選択。WebP形式には画像サイズの制限があることに注意してください。",
  "Excluded folders": "除外フォルダ",
  "Excluded folders. New files in these folders will not be processed automatically.":
    "除外フォルダ。これらのフォルダ内の新しいファイルは自動的に処理されません。",
  "Image Quality": "画質",
  "Image quality selection (30 to 100).": "画質選択 (30〜100)。",
  "File size lower limit in Kb": "ファイルサイズ下限 (KB)",
  "Do not download files with size less than this value. Set 0 for no limit.":
    "この値より小さいファイルはダウンロードしません。制限なしにするには0を設定。",
  Exclusions: "除外",
  "The plugin will not download attachments with these extensions.":
    "プラグインはこれらの拡張子を持つ添付ファイルをダウンロードしません。",
  "Do not create Obsidian attachment folder (For compatibility with other plugins)":
    "Obsidian添付フォルダを作成しない (他プラグインとの互換性のため)",
  "The plugin will not create an Obsidian attachments folder. This may cause the plugin to behave incorrectly. ":
    "プラグインはObsidian添付フォルダを作成しません。これによりプラグインが正しく動作しない可能性があります。",
  "Preserve link captions": "リンクのキャプションを保持",
  "Add media links captions to converted tags.":
    "メディアリンクのキャプションを変換されたタグに追加します。",
  "Include pattern": "含めるパターン",
  "Include only files with extensions only matching this pattern. Example: md|canvas":
    "このパターンに一致する拡張子のファイルのみを含めます。例: md|canvas",
  "Remove files completely": "ファイルを完全に削除",
  "Do not move orphaned files into the garbage can.":
    "孤立したファイルをゴミ箱に移動しません。",
  "How to write paths in tags": "タグへのパスの書き方",
  "Select whether to write full paths in tags or not.":
    "タグにフルパスを書き込むかどうかを選択します。",
  "Date format": "日付フォーマット",
  "Date format for ${date} variable. E.g. \n                  | MMMM Do YYYY, h:mm:ss a (March 20th 2024, 10:54:46 am) \n                  | dddd  (Wednesday)\n                  | MMM Do YY  (Mar 20th 24)":
    "${date}変数の日付フォーマット。例:\n                  | MMMM Do YYYY, h:mm:ss a (2024年3月20日, 10:54:46) \n                  | dddd  (水曜日)\n                  | MMM Do YY  (3月 20 24)",
  "Folder to save new attachments": "新しい添付ファイルを保存するフォルダ",
  "Select where all new attachments will be saved.\nYou can use templates e.g. _resouces/${date}/${notename}":
    "すべての新しい添付ファイルを保存する場所を選択。\nテンプレート使用例: _resources/${date}/${notename}",
  "Move/delete/rename media folder": "メディアフォルダを移動/削除/リネーム",
  "Rename or move this folder to the obsidian or system garbage can when the associated note is deleted/renamed/moved. \n                  This setting takes effect only if the path contains ${notename} template at the end\n                  and the options 'Next to note in the folder specified below' / 'Relative to note' are selected.\n                  Use this setting at your own risk.":
    "関連ノートが削除/リネーム/移動されたとき、このフォルダをObsidianまたはシステムのゴミ箱にリネーム/移動します。\n                  この設定はパスの末尾に${notename}テンプレートが含まれ、\n                  「下記指定フォルダ内でノートの隣」/「ノートからの相対」が選択されている場合のみ有効です。\n                  自己責任で使用してください。",
  "Media folder": "メディアフォルダ",
  "Folder to keep all downloaded media files.":
    "ダウンロードしたすべてのメディアファイルを保存するフォルダ。",
  Debug: "デバッグ",
  "Enable debug output to console.": "コンソールへのデバッグ出力を有効化。",
  "Interface settings": "インターフェース設定",
  "Processing settings": "処理設定",
  "Note settings": "ノート設定",
  "Orphaned attachments": "孤立した添付ファイル",
  "Media folder settings": "メディアフォルダ設定",
  Troubleshooting: "トラブルシューティング",
  "The value should be a positive integer number between 5 and 3600!":
    "値は5から3600の間の正の整数でなければなりません！",
  "The value should be a positive integer number between 1 and 6!":
    "値は1から6の間の正の整数でなければなりません！",
  "File name template cannot contain path separators. Use 'Folder to save new attachments' to set subfolders.":
    "ファイル名テンプレートにパス区切り文字を含めることはできません。サブフォルダを設定するには「新しい添付ファイルを保存するフォルダ」を使用してください。",
  "The value should be a positive integer number between 10 and 100!":
    "値は10から100の間の正の整数でなければなりません！",
  "The value should be a positive integer!":
    "値は正の整数でなければなりません！",
  "Unsafe regex! https://www.npmjs.com/package/safe-regex":
    "安全でない正規表現！ https://www.npmjs.com/package/safe-regex",
  "Unsafe folder name! Some chars are forbidden in some filesystems.":
    "安全でないフォルダ名！一部の文字は特定のファイルシステムで禁止されています。",
  WebP: "WebP",
  JPEG: "JPEG",
  "Full path": "フルパス",
  "Relative to note": "ノートからの相対パス",
  "Only filename": "ファイル名のみ",
  "Copy Obsidian settings": "Obsidian設定をコピー",
  "In the root folder specified below": "下記指定のルートフォルダ内",
  "Next to note in the folder specified below":
    "下記指定フォルダ内でノートの隣",
};
