export default {
  "Show notifications": "Bildirimleri Göster",
  "Show notifications when pages were processed.":
    "Sayfalar işlendiğinde bildirimleri göster.",
  "Context menu: download single image": "Bağlam menüsü: tek görsel indir",
  "Show 'Download this image' when right-clicking a remote image in Live Preview. Downloads only that image and replaces its link.":
    "Canlı Önizleme'de uzak bir görsele sağ tıklandığında 'Bu görseli indir' göster. Sadece o görseli indirir ve bağlantısını değiştirir.",
  "Disable additional commands": "Ek komutları devre dışı bırak",
  "Do not show additional commands in command palette. Reload the plugin in settings to take effect (turn off/on).":
    "Komut paletinde ek komutları gösterme. Ayarlar eklentiyi yeniden yükleyerek etkili hale getirin (kapat/aç).",
  "Automatic processing": "Otomatik işleme",
  "Process notes on create/copy/paste.":
    "Oluşturma/kopyalama/yapıştırma işlemlerinde notları işle.",
  "Process images in frontmatter": "Frontmatter'daki görselleri işle",
  "Download and localize image links in the YAML frontmatter. When disabled the frontmatter block is left untouched ('source' key is still used as referer for body images).":
    "YAML frontmatter'daki görsel bağlantılarını indir ve yerelleştir. Devre dışı bırakıldığında frontmatter bloğu dokunulmaz ('source' anahtarı gövde görselleri için referans olarak kullanılır).",
  "Automatic processing interval": "Otomatik işleme aralığı",
  "Interval in seconds for processing update. It takes some time to reveal changed content of a note to plugins.":
    "İşleme güncellemesi için saniye cinsinden aralık. Bir notun değiştirilmiş içeriğinin eklentilere yansması biraz zaman alır.",
  "Number of retries for every single attachment":
    "Her ek için yeniden deneme sayısı",
  "If an error occurs during downloading (network etc.) try to re-download several times.":
    "İndirme sırasında hata oluşursa (ağ vb.) yeniden indirmeyi birkaç kez dene.",
  "Process all new markdown files": "Tüm yeni markdown dosyalarını işle",
  "Process all new created/cloud-synced files with corresponding extensions.":
    "İlgili uzantılara sahip tüm yeni oluşturulan/bulut-senkronize edilmiş dosyaları işle.",
  "Process all new attachments": "Tüm yeni ekleri işle",
  "The plugin will also move all attachments from obsidian default folder to plugin folder.":
    "Eklenti ayrıca tüm ekleri Obsidian varsayılan klasöründen eklenti klasörüne taşıyacaktır.",
  "File name template": "Dosya adı şablonu",
  "Template for new attachment names. Variables: ${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}. Default: ${md5}_MD5 (backward compatible). Examples: ${originalname}, ${notename}-${originalname}, ${date}-${md5:8}. Use 'Folder to save new attachments' for subfolders.":
    "Yeni ek isimleri için şablon. Değişkenler: ${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}. Varsayılan: ${md5}_MD5 (geri dönük uyumlu). Örnekler: ${originalname}, ${notename}-${originalname}, ${date}-${md5:8}. 'Yeni ekleri kaydetmek için klasör' alt klasörler için kullanın.",
  "Use markdown link format with angle brackets ![](<link>)":
    "Açılı ayraçlı markdown bağlantı formatını kullan ![](<link>)",
  "Force using markdown link format with angle brackets instead of encoded URI when generating links.":
    "Bağlantı oluştururken kodlanmış URI yerine açılı ayraçlı markdown bağlantı formatını zorla kullan.",
  "Process Canvas files": "Canvas dosyalarını işle",
  "Process images in Obsidian Canvas (.canvas files)":
    "Obsidian Canvas (.canvas dosyaları) içindeki görselleri işle",
  "URL exclude regexps": "URL hariç tutma regexleri",
  "One per line: regexps to exclude URLs when downloading. Examples:\n^https://example\\.com/.*\n.*ads\\..*":
    "Satır başına bir tane: indirme sırasında URL'leri hariç tutmak için regexler. Örnekler:\n^https://example\\.com/.*\n.*ads\\..*",
  "Download unknown filetypes": "Bilinmeyen dosya türlerini indir",
  "Download unknown filetypes and save them with .unknown extension.":
    "Bilinmeyen dosya türlerini indir ve .unknown uzantısıyla kaydet.",
  "Compress images (Web Images)": "Görselleri sıkıştır (Web Görselleri)",
  "Compress all downloaded images. May reduce file size by several times, but can also affect performance.":
    "İndirilen tüm görselleri sıkıştır. Dosya boyutunu birkaç kat azaltabilir, ancak performansı da etkileyebilir.",
  "Compress images (Pasted Images)":
    "Görselleri sıkıştır (Yapıştırılan Görseller)",
  "Compress all pasted images. May reduce file size by several times, but can also affect performance.":
    "Yapıştırılan tüm görselleri sıkıştır. Dosya boyutunu birkaç kat azaltabilir, ancak performansı da etkileyebilir.",
  "Compression type": "Sıkıştırma türü",
  "Select image compression type. Keep in mind that webp format has image size limitations.":
    "Görsel sıkıştırma türü seç. Webp formatının görsel boyutu sınırlamaları olduğunu unutma.",
  "Excluded folders": "Hariç tutulan klasörler",
  "Excluded folders. New files in these folders will not be processed automatically.":
    "Hariç tutulan klasörler. Bu klasörlerdeki yeni dosyalar otomatik işlenmeyecektir.",
  "Image Quality": "Görsel Kalitesi",
  "Image quality selection (30 to 100).":
    "Görsel kalitesi seçimi (30 ile 100 arası).",
  "File size lower limit in Kb": "Dosya boyutu alt sınırı (KB)",
  "Do not download files with size less than this value. Set 0 for no limit.":
    "Bu değerden küçük dosyaları indirme. Sınırsız için 0 ayarla.",
  Exclusions: "Hariç tutmalar",
  "The plugin will not download attachments with these extensions.":
    "Eklenti bu uzantılı ekleri indirmeyecektir.",
  "Do not create Obsidian attachment folder (For compatibility with other plugins)":
    "Obsidian ek klasörü oluşturma (Diğer eklentilerle uyumluluk için)",
  "The plugin will not create an Obsidian attachments folder. This may cause the plugin to behave incorrectly. ":
    "Eklenti Obsidian ek klasörü oluşturmayacak. Bu eklentinin yanlış davranmasına neden olabilir.",
  "Preserve link captions": "Bağlantı altyazılarını koru",
  "Add media links captions to converted tags.":
    "Medya bağlantı altyazılarını dönüştürülmüş etiketlere ekle.",
  "Include pattern": "Dahil etme deseni",
  "Include only files with extensions only matching this pattern. Example: md|canvas":
    "Bu desene uyan uzantılı dosyaları dahil et. Örnek: md|canvas",
  "Remove files completely": "Dosyaları tamamen kaldır",
  "Do not move orphaned files into the garbage can.":
    "Ebeveynsiz dosyaları çöp kutusuna taşıma.",
  "How to write paths in tags": "Etiketlerde yolları nasıl yazacağız",
  "Select whether to write full paths in tags or not.":
    "Etiketlerde tam yollar yazılıp yazılmayacağını seçin.",
  "Date format": "Tarih formatı",
  "Date format for ${date} variable. E.g. \n                  | MMMM Do YYYY, h:mm:ss a (March 20th 2024, 10:54:46 am) \n                  | dddd  (Wednesday)\n                  | MMM Do YY  (Mar 20th 24)":
    "${date} değişkeni için tarih formatı. Örn. :\n                  | MMMM Do YYYY, h:mm:ss a (20 Mart 2024, 10:54:46) \n                  | dddd  (Çarşamba)\n                  | MMM Do YY  (Mar 20 24)",
  "Folder to save new attachments": "Yeni ekleri kaydetmek için klasör",
  "Select where all new attachments will be saved.\nYou can use templates e.g. _resouces/${date}/${notename}":
    "Tüm yeni eklerin kaydedileceği yeri seçin.\nŞablon kullanabilirsiniz örn. _resources/${date}/${notename}",
  "Move/delete/rename media folder":
    "Medya klasörünü taşı/sil/yeniden adlandır",
  "Rename or move this folder to the obsidian or system garbage can when the associated note is deleted/renamed/moved. \n                  This setting takes effect only if the path contains ${notename} template at the end\n                  and the options 'Next to note in the folder specified below' / 'Relative to note' are selected.\n                  Use this setting at your own risk.":
    "İlgili not silindiğinde/yeniden adlandırıldığında/taşıdığında bu klasörü Obsidian veya sistem çöp kutusuna yeniden adlandırın veya taşıyın. \n                  Bu ayar sadece yol ${notename} şablonunu sonuna içeriyorsa ve 'Aşağıda belirtilen klasörde notun yanında' / 'Notla göreli' seçenekleri seçiliyse geçerlidir.\n                  Bu ayarı kendi riskinizle kullanın.",
  "Media folder": "Medya klasörü",
  "Folder to keep all downloaded media files.":
    "İndirilen tüm medya dosyalarını tutacak klasör.",
  Debug: "Hata ayıklama",
  "Enable debug output to console.":
    "Konsola hata ayıklama çıktısını etkinleştir.",
  "Interface settings": "Arayüz ayarları",
  "Processing settings": "İşleme ayarları",
  "Note settings": "Not ayarları",
  "Orphaned attachments": "Ebeveynsiz ekler",
  "Media folder settings": "Medya klasörü ayarları",
  Troubleshooting: "Sorun giderme",
  "The value should be a positive integer number between 5 and 3600!":
    "Değer 5 ile 3600 arasında pozitif bir tam sayı olmalıdır!",
  "The value should be a positive integer number between 1 and 6!":
    "Değer 1 ile 6 arasında pozitif bir tam sayı olmalıdır!",
  "File name template cannot contain path separators. Use 'Folder to save new attachments' to set subfolders.":
    "Dosya adı şablonu yol ayırıcıları içeremez. Alt klasörleri ayarlamak için 'Yeni ekleri kaydetmek için klasör'ü kullanın.",
  "The value should be a positive integer number between 10 and 100!":
    "Değer 10 ile 100 arasında pozitif bir tam sayı olmalıdır!",
  "The value should be a positive integer!":
    "Değer pozitif bir tam sayı olmalıdır!",
  "Unsafe regex! https://www.npmjs.com/package/safe-regex":
    "Güvenli olmayan regex! https://www.npmjs.com/package/safe-regex",
  "Unsafe folder name! Some chars are forbidden in some filesystems.":
    "Güvenli olmayan klasör adı! Bazı karakterler bazı dosya sistemlerinde yasaktır.",
  WebP: "WebP",
  JPEG: "JPEG",
  "Full path": "Tam yol",
  "Relative to note": "Notla göreli",
  "Only filename": "Sadece dosya adı",
  "Copy Obsidian settings": "Obsidian ayarlarını kopyala",
  "In the root folder specified below": "Aşağıda belirtilen kök klasörde",
  "Next to note in the folder specified below":
    "Aşağıda belirtilen klasörde notun yanında",

  "Cannot copy/download an attachment! Try to add referer in frontmatter 'source' field.": "Ek kopyalanamıyor/indirilemiyor! Frontmatter 'source' alanına referer eklemeyi deneyin.",

  "{p} file(s) {p}": "{p} dosya {p}",

  "{p} attachments for note {p}": "{p} ekleri not {p}",


  "Frontmatter of '{p}' skipped (parse error)": "'{p}' frontmatter atlandı (ayrıştırma hatası)",

  "You obsidian media folder set to {p}, and has been created by the plugin. Please, try again.": "Obsidian medya klasörü {p} olarak ayarlandı ve eklenti tarafından oluşturuldu. Lütfen tekrar deneyin.",

  "You obsidian media folder set to {p}, and has been changed to {p}. Please, note that the plugin settings might need to be updated.": "Obsidian medya klasörü {p} iken {p} olarak değiştirildi. Eklenti ayarlarının güncellenmesi gerekebilir.",

  "Attachment folder was renamed to {p}": "Ek dosya klasörü {p} olarak yeniden adlandırıldı",

  "Attachment folder {p} was moved to trash can.": "Ek dosya klasörü {p} çöp kutusuna taşındı.",

  "Attachments for '{p}' were processed.": "'{p}' için ekler işlendi.",

  "Cannot get current note! ": "Mevcut not alınamıyor! ",

  "Cannot get current note/canvas!": "Mevcut not/canvas alınamıyor!",

  "Cannot move attachment folder: \r\n{p}": "Ek dosya klasörü taşınamıyor: \r\n{p}",

  "Cannot rename.": "Yeniden adlandırılamıyor.",

  "Image downloaded and linked in '{p}'.": "Resim indirildi ve '{p}' içinde bağlandı.",

  "Media links were found, processing...": "Medya bağlantıları bulundu, işleniyor...",

  "No orphaned files found!": "Baba eşi olmayan dosya bulunamadı!",

  "Page '{p}' has been processed, but nothing was changed.": "'{p}' sayfası işlendi ama hiçbir şey değişmedi.",

  "Please select a note or click inside selected note in canvas.": "Lütfen bir not seçin veya canvas'ta seçili notun içine tıklayın.",

  "Please, select a note or click inside a note in canvas!": "Lütfen bir not seçin veya canvas'ta bir notun içine tıklayın!",

  "Remote image not found in '{p}' or it is already local.": "Uzak resim '{p}' içinde bulunamadı veya zaten yerel.",

  "Single image download failed: {p}": "Tek resim indirme başarısız: {p}",

  "The attachment folder {p} does not exist!": "Ek dosya klasörü {p} mevcut değil!",

  "The note was renamed to {p}": "Not {p} olarak yeniden adlandırıldı",

  "This command cannot run on vault's root or on subfolder next to note!\nPlease, change settings first!\r\n": "Bu komut vault kökünde veya notun yanındaki alt klasörde çalıştırılamaz!\nLütfen önce ayarları değiştirin!\r\n",

  "This command requires the settings 'Next to note in the folder specified below' and pattern '${notename}' at the end to be enabled, also the path cannot contain ${date} pattern.\nPlease, change settings first!\r\n": "Bu komut, aşağıda belirtilen klasördeki 'Notun yanında' ayarının ve '${notename}' deseninin sonunda etkinleştirilmesini, ayrıca yolların ${date} desenini içermemesini gerektirir.\nLütfen önce ayarları değiştirin!\r\n",

  "WARNING!\r\nAttachments for \'{p}\' were processed, but some attachments were not downloaded/replaced...": "UYARI!\r\n\'{p}\' için ekler işlendi ancak bazı ekler indirilmedi/değiştirilmedi...",

  "{p} attachments for note {p} were processed.": "{p} not için {p} ek işlendi.",
};