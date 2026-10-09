export default {
  "Show notifications": "알림 표시",
  "Show notifications when pages were processed.":
    "페이지가 처리될 때 알림을 표시합니다.",
  "Context menu: download single image": "컨텍스트 메뉴: 단일 이미지 다운로드",
  "Show 'Download this image' when right-clicking a remote image in Live Preview. Downloads only that image and replaces its link.":
    "라이브 미리보기에서 원격 이미지를 우클릭할 때 '이 이미지 다운로드'를 표시합니다. 해당 이미지만 다운로드하고 링크를 대체합니다.",
  "Disable additional commands": "추가 명령 비활성화",
  "Do not show additional commands in command palette. Reload the plugin in settings to take effect (turn off/on).":
    "명령 팔레트에 추가 명령을 표시하지 않습니다. 설정에서 플러그인을 다시 로드하여 적용하세요 (끄기/켜기).",
  "Automatic processing": "자동 처리",
  "Process notes on create/copy/paste.":
    "생성/복사/붙여넣기 시 노트를 처리합니다.",
  "Process images in frontmatter": "프론트매터의 이미지 처리",
  "Download and localize image links in the YAML frontmatter. When disabled the frontmatter block is left untouched ('source' key is still used as referer for body images).":
    "YAML 프론트매터의 이미지 링크를 다운로드하고 로컬화합니다. 비활성화 시 프론트매터 블록은 그대로 유지됩니다 ('source' 키는 본문 이미지의 참조자로 계속 사용됨).",
  "Automatic processing interval": "자동 처리 간격",
  "Interval in seconds for processing update. It takes some time to reveal changed content of a note to plugins.":
    "처리 업데이트 간격(초). 플러그인에 변경된 노트 내용이 드러나는 데 시간이 걸립니다.",
  "Number of retries for every single attachment": "각 첨부파일별 재시도 횟수",
  "If an error occurs during downloading (network etc.) try to re-download several times.":
    "다운로드 중 오류 발생 시(네트워크 등) 여러 번 재다운로드를 시도합니다.",
  "Process all new markdown files": "모든 새 마크다운 파일 처리",
  "Process all new created/cloud-synced files with corresponding extensions.":
    "해당 확장자를 가진 모든 새로 생성/클라우드 동기화된 파일을 처리합니다.",
  "Process all new attachments": "모든 새 첨부파일 처리",
  "The plugin will also move all attachments from obsidian default folder to plugin folder.":
    "플러그인은 모든 첨부파일을 Obsidian 기본 폴더에서 플러그인 폴더로 이동시킵니다.",
  "File name template": "파일명 템플릿",
  "Template for new attachment names. Variables: ${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}. Default: ${md5}_MD5 (backward compatible). Examples: ${originalname}, ${notename}-${originalname}, ${date}-${md5:8}. Use 'Folder to save new attachments' for subfolders.":
    "새 첨부파일 이름 템플릿. 변수: ${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}. 기본값: ${md5}_MD5 (하위 호환). 예: ${originalname}, ${notename}-${originalname}, ${date}-${md5:8}. '새 첨부파일 저장 폴더'로 하위 폴더 지정.",
  "Use markdown link format with angle brackets ![](<link>)":
    "꺾쇠 괄호가 있는 마크다운 링크 형식 사용 ![](<link>)",
  "Force using markdown link format with angle brackets instead of encoded URI when generating links.":
    "링크 생성 시 인코딩된 URI 대신 꺾쇠 괄호가 있는 마크다운 링크 형식을 강제 사용합니다.",
  "Process Canvas files": "Canvas 파일 처리",
  "Process images in Obsidian Canvas (.canvas files)":
    "Obsidian Canvas(.canvas 파일)의 이미지 처리",
  "URL exclude regexps": "URL 제외 정규식",
  "One per line: regexps to exclude URLs when downloading. Examples:\n^https://example\\.com/.*\n.*ads\\..*":
    "줄당 하나: 다운로드 시 제외할 URL 정규식. 예:\n^https://example\\.com/.*\n.*ads\\..*",
  "Download unknown filetypes": "알 수 없는 파일 타입 다운로드",
  "Download unknown filetypes and save them with .unknown extension.":
    "알 수 없는 파일 타입을 다운로드하고 .unknown 확장자로 저장합니다.",
  "Compress images (Web Images)": "이미지 압축 (웹 이미지)",
  "Compress all downloaded images. May reduce file size by several times, but can also affect performance.":
    "다운로드한 모든 이미지 압축. 파일 크기를 여러 배 줄일 수 있지만 성능에 영향을 줄 수 있습니다.",
  "Compress images (Pasted Images)": "이미지 압축 (붙여넣기 이미지)",
  "Compress all pasted images. May reduce file size by several times, but can also affect performance.":
    "붙여넣은 모든 이미지 압축. 파일 크기를 여러 배 줄일 수 있지만 성능에 영향을 줄 수 있습니다.",
  "Compression type": "압축 유형",
  "Select image compression type. Keep in mind that webp format has image size limitations.":
    "이미지 압축 유형 선택. WebP 형식은 이미지 크기 제한이 있음을 유의하세요.",
  "Excluded folders": "제외 폴더",
  "Excluded folders. New files in these folders will not be processed automatically.":
    "제외 폴더. 이 폴더의 새 파일은 자동으로 처리되지 않습니다.",
  "Image Quality": "이미지 품질",
  "Image quality selection (30 to 100).": "이미지 품질 선택 (30~100).",
  "File size lower limit in Kb": "파일 크기 하한 (KB)",
  "Do not download files with size less than this value. Set 0 for no limit.":
    "이 값보다 작은 파일은 다운로드하지 않습니다. 제한 없음은 0으로 설정.",
  Exclusions: "제외 항목",
  "The plugin will not download attachments with these extensions.":
    "플러그인은 이 확장자를 가진 첨부파일을 다운로드하지 않습니다.",
  "Do not create Obsidian attachment folder (For compatibility with other plugins)":
    "Obsidian 첨부 폴더 생성 안 함 (다른 플러그인과의 호환성 위해)",
  "The plugin will not create an Obsidian attachments folder. This may cause the plugin to behave incorrectly. ":
    "플러그인이 Obsidian 첨부 폴더를 생성하지 않습니다. 이로 인해 플러그인이 잘못 동작할 수 있습니다.",
  "Preserve link captions": "링크 캡션 유지",
  "Add media links captions to converted tags.":
    "미디어 링크 캡션을 변환된 태그에 추가합니다.",
  "Include pattern": "포함 패턴",
  "Include only files with extensions only matching this pattern. Example: md|canvas":
    "이 패턴과 일치하는 확장자만 가진 파일 포함. 예: md|canvas",
  "Remove files completely": "파일 완전 삭제",
  "Do not move orphaned files into the garbage can.":
    "고아 파일을 휴지통으로 이동하지 않습니다.",
  "How to write paths in tags": "태그에 경로 쓰는 방법",
  "Select whether to write full paths in tags or not.":
    "태그에 전체 경로를 쓸지 여부 선택.",
  "Date format": "날짜 형식",
  "Date format for ${date} variable. E.g. \n                  | MMMM Do YYYY, h:mm:ss a (March 20th 2024, 10:54:46 am) \n                  | dddd  (Wednesday)\n                  | MMM Do YY  (Mar 20th 24)":
    "${date} 변수의 날짜 형식. 예:\n                  | MMMM Do YYYY, h:mm:ss a (2024년 3월 20일, 오전 10:54:46) \n                  | dddd  (수요일)\n                  | MMM Do YY  (3월 20 24)",
  "Folder to save new attachments": "새 첨부파일 저장 폴더",
  "Select where all new attachments will be saved.\nYou can use templates e.g. _resouces/${date}/${notename}":
    "모든 새 첨부파일이 저장될 위치 선택.\n템플릿 사용 예: _resources/${date}/${notename}",
  "Move/delete/rename media folder": "미디어 폴더 이동/삭제/이름변경",
  "Rename or move this folder to the obsidian or system garbage can when the associated note is deleted/renamed/moved. \n                  This setting takes effect only if the path contains ${notename} template at the end\n                  and the options 'Next to note in the folder specified below' / 'Relative to note' are selected.\n                  Use this setting at your own risk.":
    "연결된 노트가 삭제/이름변경/이동될 때 이 폴더를 Obsidian 또는 시스템 휴지통으로 이름변경/이동합니다.\n                  이 설정은 경로 끝에 ${notename} 템플릿이 있고\n                  '아래 지정된 폴더에서 노트 옆' / '노트 상대' 옵션이 선택된 경우에만 적용됩니다.\n                  본인 책임 하에 사용하세요.",
  "Media folder": "미디어 폴더",
  "Folder to keep all downloaded media files.":
    "다운로드한 모든 미디어 파일을 보관할 폴더.",
  Debug: "디버그",
  "Enable debug output to console.": "콘솔에 디버그 출력 활성화.",
  "Interface settings": "인터페이스 설정",
  "Processing settings": "처리 설정",
  "Note settings": "노트 설정",
  "Orphaned attachments": "고아 첨부파일",
  "Media folder settings": "미디어 폴더 설정",
  Troubleshooting: "문제 해결",
  "The value should be a positive integer number between 5 and 3600!":
    "값은 5에서 3600 사이의 양의 정수여야 합니다!",
  "The value should be a positive integer number between 1 and 6!":
    "값은 1에서 6 사이의 양의 정수여야 합니다!",
  "File name template cannot contain path separators. Use 'Folder to save new attachments' to set subfolders.":
    "파일명 템플릿에 경로 구분자를 포함할 수 없습니다. 하위 폴더를 설정하려면 '새 첨부파일 저장 폴더'를 사용하세요.",
  "The value should be a positive integer number between 10 and 100!":
    "값은 10에서 100 사이의 양의 정수여야 합니다!",
  "The value should be a positive integer!": "값은 양의 정수여야 합니다!",
  "Unsafe regex! https://www.npmjs.com/package/safe-regex":
    "안전하지 않은 정규식! https://www.npmjs.com/package/safe-regex",
  "Unsafe folder name! Some chars are forbidden in some filesystems.":
    "안전하지 않은 폴더명! 일부 문자는 특정 파일 시스템에서 금지되어 있습니다.",
  WebP: "WebP",
  JPEG: "JPEG",
  "Full path": "전체 경로",
  "Relative to note": "노트 상대 경로",
  "Only filename": "파일명만",
  "Copy Obsidian settings": "Obsidian 설정 복사",
  "In the root folder specified below": "아래 지정된 루트 폴더에",
  "Next to note in the folder specified below": "아래 지정된 폴더에서 노트 옆",

  "Cannot copy/download an attachment! Try to add referer in frontmatter 'source' field.": "첨부 파일을 복사/다운로드할 수 없습니다! frontmatter의 'source' 필드에 referer를 추가해 보세요.",
};