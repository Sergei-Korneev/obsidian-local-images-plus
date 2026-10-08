export default {
  "Show notifications": "Pokaż powiadomienia",
  "Show notifications when pages were processed.":
    "Pokaż powiadomienia po przetworzeniu stron.",
  "Context menu: download single image":
    "Menu kontekstowe: pobierz pojedyncze zdjęcie",
  "Show 'Download this image' when right-clicking a remote image in Live Preview. Downloads only that image and replaces its link.":
    "Pokaż 'Pobierz to zdjęcie' po kliknięciu prawym przyciskiem myszy na zdalnym obrazie w Podglądzie na żywo. Pobiera tylko to zdjęcie i zastępuje jego link.",
  "Disable additional commands": "Wyłącz dodatkowe komendy",
  "Do not show additional commands in command palette. Reload the plugin in settings to take effect (turn off/on).":
    "Nie pokazuj dodatkowych komend w palecie komend. Przeładuj wtyczkę w ustawieniach, aby changes weszły w życie (wyłącz/włącz).",
  "Automatic processing": "Automatyczne przetwarzanie",
  "Process notes on create/copy/paste.":
    "Przetwarzaj notatki przy tworzeniu/kopiowaniu/wklejaniu.",
  "Process images in frontmatter": "Przetwarzaj obrazy we frontmatter",
  "Download and localize image links in the YAML frontmatter. When disabled the frontmatter block is left untouched ('source' key is still used as referer for body images).":
    "Pobieraj i lokalizuj linki do obrazów w YAML frontmatter. Gdy wyłączone, blok frontmatter pozostaje nienaruszony (klucz 'source' nadal używany jako referer dla obrazów w treści).",
  "Automatic processing interval": "Interwał automatycznego przetwarzania",
  "Interval in seconds for processing update. It takes some time to reveal changed content of a note to plugins.":
    "Interwał w sekundach do aktualizacji przetwarzania. Potrzeba trochę czasu, aby zmieniona treść notatki stała się dostępna dla wtyczek.",
  "Number of retries for every single attachment":
    "Liczba prób dla każdego załącznika",
  "If an error occurs during downloading (network etc.) try to re-download several times.":
    "Jeśli wystąpi błąd podczas pobierania (sieć itp.), spróbuj pobrać ponownie kilka razy.",
  "Process all new markdown files": "Przetwarzaj wszystkie nowe pliki markdown",
  "Process all new created/cloud-synced files with corresponding extensions.":
    "Przetwarzaj wszystkie nowe utworzone/pliki zsynchronizowane z chmurą z odpowiadającymi rozszerzeniami.",
  "Process all new attachments": "Przetwarzaj wszystkie nowe załączniki",
  "The plugin will also move all attachments from obsidian default folder to plugin folder.":
    "Wtyczka również przeniesie wszystkie załączniki z domyślnego folderu Obsidian do folderu wtyczki.",
  "File name template": "Szablon nazwy pliku",
  "Template for new attachment names. Variables: ${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}. Default: ${md5}_MD5 (backward compatible). Examples: ${originalname}, ${notename}-${originalname}, ${date}-${md5:8}. Use 'Folder to save new attachments' for subfolders.":
    "Szablon nazw nowych załączników. Zmienne: ${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}. Domyślnie: ${md5}_MD5 (kompatybilność wsteczna). Przykłady: ${originalname}, ${notename}-${originalname}, ${date}-${md5:8}. Użyj 'Folder do zapisywania nowych załączników' dla podfolderów.",
  "Use markdown link format with angle brackets ![](<link>)":
    "Użyj formatu linku markdown z nawiasami kątowymi ![](<link>)",
  "Force using markdown link format with angle brackets instead of encoded URI when generating links.":
    "Wymuś użycie formatu linku markdown z nawiasami kątowymi zamiast zakodowanego URI przy generowaniu linków.",
  "Process Canvas files": "Przetwarzaj pliki Canvas",
  "Process images in Obsidian Canvas (.canvas files)":
    "Przetwarzaj obrazy w Obsidian Canvas (pliki .canvas)",
  "URL exclude regexps": "Wyrażenia regularne do wykluczania URL",
  "One per line: regexps to exclude URLs when downloading. Examples:\n^https://example\\.com/.*\n.*ads\\..*":
    "Po jednym w linii: wyrażenia regularne do wykluczania URL podczas pobierania. Przykłady:\n^https://example\\.com/.*\n.*ads\\..*",
  "Download unknown filetypes": "Pobieraj nieznane typy plików",
  "Download unknown filetypes and save them with .unknown extension.":
    "Pobieraj nieznane typy plików i zapisuj je z rozszerzeniem .unknown.",
  "Compress images (Web Images)": "Kompresuj obrazy (Obrazy z sieci)",
  "Compress all downloaded images. May reduce file size by several times, but can also affect performance.":
    "Kompresuj wszystkie pobrane obrazy. Może zmniejszyć rozmiar pliku kilka razy, ale może też wpłynąć na wydajność.",
  "Compress images (Pasted Images)": "Kompresuj obrazy (Wklejone obrazy)",
  "Compress all pasted images. May reduce file size by several times, but can also affect performance.":
    "Kompresuj wszystkie wklejone obrazy. Może zmniejszyć rozmiar pliku kilka razy, ale może też wpłynąć na wydajność.",
  "Compression type": "Typ kompresji",
  "Select image compression type. Keep in mind that webp format has image size limitations.":
    "Wybierz typ kompresji obrazów. Pamiętaj, że format webp ma ograniczenia rozmiaru obrazu.",
  "Excluded folders": "Wykluczone foldery",
  "Excluded folders. New files in these folders will not be processed automatically.":
    "Wykluczone foldery. Nowe pliki w tych folderach nie będą przetwarzane automatycznie.",
  "Image Quality": "Jakość obrazu",
  "Image quality selection (30 to 100).":
    "Wybór jakości obrazu (od 30 do 100).",
  "File size lower limit in Kb": "Dolny limit rozmiaru pliku w KB",
  "Do not download files with size less than this value. Set 0 for no limit.":
    "Nie pobieraj plików mniejszych niż ta wartość. Ustaw 0 dla braku limitu.",
  Exclusions: "Wykluczenia",
  "The plugin will not download attachments with these extensions.":
    "Wtyczka nie będzie pobierać załączników z tymi rozszerzeniami.",
  "Do not create Obsidian attachment folder (For compatibility with other plugins)":
    "Nie twórz folderu załączników Obsidian (Dla kompatybilności z innymi wtyczkami)",
  "The plugin will not create an Obsidian attachments folder. This may cause the plugin to behave incorrectly. ":
    "Wtyczka nie utworzy folderu załączników Obsidian. Może to spowodować nieprawidłowe działanie wtyczki.",
  "Preserve link captions": "Zachowaj podpisy linków",
  "Add media links captions to converted tags.":
    "Dodaj podpisy linków multimedialnych do przekonwertowanych tagów.",
  "Include pattern": "Wzór dołączania",
  "Include only files with extensions only matching this pattern. Example: md|canvas":
    "Dołączaj tylko pliki z rozszerzeniami pasującymi do tego wzoru. Przykład: md|canvas",
  "Remove files completely": "Usuwaj pliki całkowicie",
  "Do not move orphaned files into the garbage can.":
    "Nie przenoś osieroconych plików do kosza.",
  "How to write paths in tags": "Jak zapisywać ścieżki w tagach",
  "Select whether to write full paths in tags or not.":
    "Wybierz, czy zapisywać pełne ścieżki w tagach, czy nie.",
  "Date format": "Format daty",
  "Date format for ${date} variable. E.g. \n                  | MMMM Do YYYY, h:mm:ss a (March 20th 2024, 10:54:46 am) \n                  | dddd  (Wednesday)\n                  | MMM Do YY  (Mar 20th 24)":
    "Format daty dla zmiennej ${date}. Np.\n                  | MMMM Do YYYY, h:mm:ss a (20 marca 2024, 10:54:46) \n                  | dddd  (środa)\n                  | MMM Do YY  (mar 20 24)",
  "Folder to save new attachments": "Folder do zapisywania nowych załączników",
  "Select where all new attachments will be saved.\nYou can use templates e.g. _resouces/${date}/${notename}":
    "Wybierz, gdzie będą zapisywane wszystkie nowe załączniki.\nMożesz używać szablonów np. _resources/${date}/${notename}",
  "Move/delete/rename media folder": "Przenieś/usuń/zmień nazwę folderu mediów",
  "Rename or move this folder to the obsidian or system garbage can when the associated note is deleted/renamed/moved. \n                  This setting takes effect only if the path contains ${notename} template at the end\n                  and the options 'Next to note in the folder specified below' / 'Relative to note' are selected.\n                  Use this setting at your own risk.":
    "Zmień nazwę lub przenieś ten folder do kosza Obsidian lub systemowego, gdy skojarzona notatka zostanie usunięta/przeniesiona/zmieniona nazwa. \n                  To ustawienie działa tylko jeśli ścieżka zawiera szablon ${notename} na końcu\n                  i wybrano opcje 'Obok notatki w folderze poniżej' / 'Względem notatki'.\n                  Używaj na własne ryzyko.",
  "Media folder": "Folder mediów",
  "Folder to keep all downloaded media files.":
    "Folder do przechowywania wszystkich pobranych plików multimedialnych.",
  Debug: "Debugowanie",
  "Enable debug output to console.": "Włącz wyjście debugowania do konsoli.",
  "Interface settings": "Ustawienia interfejsu",
  "Processing settings": "Ustawienia przetwarzania",
  "Note settings": "Ustawienia notatek",
  "Orphaned attachments": "Osierocone załączniki",
  "Media folder settings": "Ustawienia folderu mediów",
  Troubleshooting: "Rozwiązywanie problemów",
  "The value should be a positive integer number between 5 and 3600!":
    "Wartość musi być dodatnią liczbą całkowitą z przedziału 5 do 3600!",
  "The value should be a positive integer number between 1 and 6!":
    "Wartość musi być dodatnią liczbą całkowitą z przedziału 1 do 6!",
  "File name template cannot contain path separators. Use 'Folder to save new attachments' to set subfolders.":
    "Szablon nazwy pliku nie może zawierać separatorów ścieżek. Użyj 'Folderu do zapisywania nowych załączników' do ustawienia podfolderów.",
  "The value should be a positive integer number between 10 and 100!":
    "Wartość musi być dodatnią liczbą całkowitą z przedziału 10 do 100!",
  "The value should be a positive integer!":
    "Wartość musi być dodatnią liczbą całkowitą!",
  "Unsafe regex! https://www.npmjs.com/package/safe-regex":
    "Niebezpieczne wyrażenie regularne! https://www.npmjs.com/package/safe-regex",
  "Unsafe folder name! Some chars are forbidden in some filesystems.":
    "Niebezpieczna nazwa folderu! Niektóre znaki są zabronione w niektórych systemach plików.",
  WebP: "WebP",
  JPEG: "JPEG",
  "Full path": "Pełna ścieżka",
  "Relative to note": "Względem notatki",
  "Only filename": "Tylko nazwa pliku",
  "Copy Obsidian settings": "Skopiuj ustawienia Obsidian",
  "In the root folder specified below": "W folderze głównym podanym poniżej",
  "Next to note in the folder specified below":
    "Obok notatki w folderze podanym poniżej",
};
