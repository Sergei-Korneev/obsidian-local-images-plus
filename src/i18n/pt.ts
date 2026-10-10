export default {
  "Show notifications": "Mostrar notificações",
  "Show notifications when pages were processed.":
    "Mostrar notificações quando as páginas foram processadas.",
  "Context menu: download single image":
    "Menu de contexto: baixar imagem individual",
  "Show 'Download this image' when right-clicking a remote image in Live Preview. Downloads only that image and replaces its link.":
    "Mostrar 'Baixar esta imagem' ao clicar com o botão direito em uma imagem remota na Visualização ao Vivo. Baixa apenas essa imagem e substitui o link.",
  "Disable additional commands": "Desativar comandos adicionais",
  "Do not show additional commands in command palette. Reload the plugin in settings to take effect (turn off/on).":
    "Não mostrar comandos adicionais na paleta de comandos. Recarregue o plugin nas configurações para ter efeito (desligar/ligar).",
  "Automatic processing": "Processamento automático",
  "Process notes on create/copy/paste.":
    "Processar notas ao criar/copiar/colar.",
  "Process images in frontmatter": "Processar imagens no frontmatter",
  "Download and localize image links in the YAML frontmatter. When disabled the frontmatter block is left untouched ('source' key is still used as referer for body images).":
    "Baixar e localizar links de imagens no frontmatter YAML. Quando desativado, o bloco frontmatter permanece intocado (a chave 'source' ainda é usada como referenciador para imagens do corpo).",
  "Automatic processing interval": "Intervalo de processamento automático",
  "Interval in seconds for processing update. It takes some time to reveal changed content of a note to plugins.":
    "Intervalo em segundos para atualização de processamento. Leva algum tempo para revelar conteúdo alterado de uma nota aos plugins.",
  "Number of retries for every single attachment":
    "Número de tentativas para cada anexo",
  "If an error occurs during downloading (network etc.) try to re-download several times.":
    "Se ocorrer um erro durante o download (rede etc.) tente baixar novamente várias vezes.",
  "Process all new markdown files":
    "Processar todos os novos arquivos markdown",
  "Process all new created/cloud-synced files with corresponding extensions.":
    "Processar todos os arquivos novos criados/sincronizados na nuvem com extensões correspondentes.",
  "Process all new attachments": "Processar todos os novos anexos",
  "The plugin will also move all attachments from obsidian default folder to plugin folder.":
    "O plugin também moverá todos os anexos da pasta padrão do Obsidian para a pasta do plugin.",
  "File name template": "Modelo de nome de arquivo",
  "Template for new attachment names. Variables: ${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}. Default: ${md5}_MD5 (backward compatible). Examples: ${originalname}, ${notename}-${originalname}, ${date}-${md5:8}. Use 'Folder to save new attachments' for subfolders.":
    "Modelo para nomes de novos anexos. Variáveis: ${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}. Padrão: ${md5}_MD5 (compatível com versões anteriores). Exemplos: ${originalname}, ${notename}-${originalname}, ${date}-${md5:8}. Use 'Pasta para salvar novos anexos' para subpastas.",
  "Use markdown link format with angle brackets ![](<link>)":
    "Usar formato de link markdown com colchetes angulares ![](<link>)",
  "Force using markdown link format with angle brackets instead of encoded URI when generating links.":
    "Forçar uso do formato de link markdown com colchetes angulares em vez de URI codificado ao gerar links.",
  "Process Canvas files": "Processar arquivos Canvas",
  "Process images in Obsidian Canvas (.canvas files)":
    "Processar imagens no Obsidian Canvas (arquivos .canvas)",
  "URL exclude regexps": "Expressões regulares para excluir URLs",
  "One per line: regexps to exclude URLs when downloading. Examples:\n^https://example\\.com/.*\n.*ads\\..*":
    "Uma por linha: expressões regulares para excluir URLs ao baixar. Exemplos:\n^https://example\\.com/.*\n.*ads\\..*",
  "Download unknown filetypes": "Baixar tipos de arquivo desconhecidos",
  "Download unknown filetypes and save them with .unknown extension.":
    "Baixar tipos de arquivo desconhecidos e salvá-los com extensão .unknown.",
  "Compress images (Web Images)": "Comprimir imagens (Imagens Web)",
  "Compress all downloaded images. May reduce file size by several times, but can also affect performance.":
    "Comprimir todas as imagens baixadas. Pode reduzir o tamanho do arquivo várias vezes, mas também pode afetar o desempenho.",
  "Compress images (Pasted Images)": "Comprimir imagens (Imagens coladas)",
  "Compress all pasted images. May reduce file size by several times, but can also affect performance.":
    "Comprimir todas as imagens coladas. Pode reduzir o tamanho do arquivo várias vezes, mas também pode afetar o desempenho.",
  "Compression type": "Tipo de compressão",
  "Select image compression type. Keep in mind that webp format has image size limitations.":
    "Selecionar tipo de compressão de imagem. Lembre-se que o formato webp tem limitações de tamanho de imagem.",
  "Excluded folders": "Pastas excluídas",
  "Excluded folders. New files in these folders will not be processed automatically.":
    "Pastas excluídas. Novos arquivos nestas pastas não serão processados automaticamente.",
  "Image Quality": "Qualidade da imagem",
  "Image quality selection (30 to 100).":
    "Seleção de qualidade da imagem (30 a 100).",
  "File size lower limit in Kb": "Limite inferior de tamanho de arquivo em KB",
  "Do not download files with size less than this value. Set 0 for no limit.":
    "Não baixar arquivos com tamanho menor que este valor. Defina 0 para sem limite.",
  Exclusions: "Exclusões",
  "The plugin will not download attachments with these extensions.":
    "O plugin não baixará anexos com estas extensões.",
  "Do not create Obsidian attachment folder (For compatibility with other plugins)":
    "Não criar pasta de anexos do Obsidian (Para compatibilidade com outros plugins)",
  "The plugin will not create an Obsidian attachments folder. This may cause the plugin to behave incorrectly. ":
    "O plugin não criará uma pasta de anexos do Obsidian. Isso pode fazer com que o plugin se comporte incorretamente.",
  "Preserve link captions": "Preservar legendas de links",
  "Add media links captions to converted tags.":
    "Adicionar legendas de links de mídia a tags convertidas.",
  "Include pattern": "Padrão de inclusão",
  "Include only files with extensions only matching this pattern. Example: md|canvas":
    "Incluir apenas arquivos com extensões correspondentes a este padrão. Exemplo: md|canvas",
  "Remove files completely": "Remover arquivos completamente",
  "Do not move orphaned files into the garbage can.":
    "Não mover arquivos órfãos para a lixeira.",
  "How to write paths in tags": "Como escrever caminhos nas tags",
  "Select whether to write full paths in tags or not.":
    "Selecionar se deve escrever caminhos completos nas tags ou não.",
  "Date format": "Formato de data",
  "Date format for ${date} variable. E.g. \n                  | MMMM Do YYYY, h:mm:ss a (March 20th 2024, 10:54:46 am) \n                  | dddd  (Wednesday)\n                  | MMM Do YY  (Mar 20th 24)":
    "Formato de data para a variável ${date}. Ex. :\n                  | MMMM Do YYYY, h:mm:ss a (20 de março de 2024, 10:54:46) \n                  | dddd  (quarta-feira)\n                  | MMM Do YY  (mar 20 24)",
  "Folder to save new attachments": "Pasta para salvar novos anexos",
  "Select where all new attachments will be saved.\nYou can use templates e.g. _resouces/${date}/${notename}":
    "Selecionar onde todos os novos anexos serão salvos.\nVocê pode usar modelos ex. _resources/${date}/${notename}",
  "Move/delete/rename media folder": "Mover/excluir/renomear pasta de mídia",
  "Rename or move this folder to the obsidian or system garbage can when the associated note is deleted/renamed/moved. \n                  This setting takes effect only if the path contains ${notename} template at the end\n                  and the options 'Next to note in the folder specified below' / 'Relative to note' are selected.\n                  Use this setting at your own risk.":
    "Renomear ou mover esta pasta para a lixeira do Obsidian ou do sistema quando a nota associada for excluída/renomeada/movida. \n                  Esta configuração só tem efeito se o caminho contiver o modelo ${notename} no final\n                  e as opções 'Ao lado da nota na pasta especificada abaixo' / 'Relativo à nota' estiverem selecionadas.\n                  Use esta configuração por sua conta e risco.",
  "Media folder": "Pasta de mídia",
  "Folder to keep all downloaded media files.":
    "Pasta para manter todos os arquivos de mídia baixados.",
  Debug: "Depuração",
  "Enable debug output to console.": "Ativar saída de depuração no console.",
  "Interface settings": "Configurações da interface",
  "Processing settings": "Configurações de processamento",
  "Note settings": "Configurações de notas",
  "Orphaned attachments": "Anexos órfãos",
  "Media folder settings": "Configurações da pasta de mídia",
  Troubleshooting: "Solução de problemas",
  "The value should be a positive integer number between 5 and 3600!":
    "O valor deve ser um número inteiro positivo entre 5 e 3600!",
  "The value should be a positive integer number between 1 and 6!":
    "O valor deve ser um número inteiro positivo entre 1 e 6!",
  "File name template cannot contain path separators. Use 'Folder to save new attachments' to set subfolders.":
    "O modelo de nome de arquivo não pode conter separadores de caminho. Use 'Pasta para salvar novos anexos' para definir subpastas.",
  "The value should be a positive integer number between 10 and 100!":
    "O valor deve ser um número inteiro positivo entre 10 e 100!",
  "The value should be a positive integer!":
    "O valor deve ser um número inteiro positivo!",
  "Unsafe regex! https://www.npmjs.com/package/safe-regex":
    "Regex inseguro! https://www.npmjs.com/package/safe-regex",
  "Unsafe folder name! Some chars are forbidden in some filesystems.":
    "Nome de pasta inseguro! Alguns caracteres são proibidos em alguns sistemas de arquivos.",
  WebP: "WebP",
  JPEG: "JPEG",
  "Full path": "Caminho completo",
  "Relative to note": "Relativo à nota",
  "Only filename": "Apenas nome do arquivo",
  "Copy Obsidian settings": "Copiar configurações Obsidian",
  "In the root folder specified below": "Na pasta raiz especificada abaixo",
  "Next to note in the folder specified below":
    "Ao lado da nota na pasta especificada abaixo",

  "Cannot copy/download an attachment! Try to add referer in frontmatter 'source' field.": "Não foi possível copiar/baixar o anexo! Tente adicionar referer no campo 'source' do frontmatter.",

  "{p} file(s) {p}": "{p} ficheiro(s) {p}",

  "{p} attachments for note {p}": "{p} anexos para a nota {p}",


  "Frontmatter of '{p}' skipped (parse error)": "Frontmatter de '{p}' ignorado (erro de análise)",

  "You obsidian media folder set to {p}, and has been created by the plugin. Please, try again.": "A pasta de multimédia do Obsidian definida como {p} foi criada pelo plugin. Tente novamente.",

  "You obsidian media folder set to {p}, and has been changed to {p}. Please, note that the plugin settings might need to be updated.": "A pasta de multimédia do Obsidian definida como {p} foi alterada para {p}. Pode ser necessário atualizar as definições do plugin.",

  "Attachment folder was renamed to {p}": "A pasta de anexos foi renomeada para {p}",

  "Attachment folder {p} was moved to trash can.": "A pasta de anexos {p} foi movida para a lixeira.",

  "Attachments for '{p}' were processed.": "Os anexos para '{p}' foram processados.",

  "Cannot get current note! ": "Não foi possível obter a nota atual! ",

  "Cannot get current note/canvas!": "Não é possível obter a nota/canvas atual!",

  "Cannot move attachment folder: \r\n{p}": "Não é possível mover a pasta de anexos: \r\n{p}",

  "Cannot rename.": "Não é possível renomear.",

  "Image downloaded and linked in '{p}'.": "Imagem baixada e vinculada em '{p}'.",

  "Media links were found, processing...": "Links de mídia encontrados, processando...",

  "No orphaned files found!": "Nenhum arquivo órfão encontrado!",

  "Page '{p}' has been processed, but nothing was changed.": "A página '{p}' foi processada, mas nada mudou.",

  "Please select a note or click inside selected note in canvas.": "Por favor, selecione uma nota ou clique dentro da nota selecionada no canvas.",

  "Please, select a note or click inside a note in canvas!": "Por favor, selecione uma nota ou clique dentro de uma nota no canvas!",

  "Remote image not found in '{p}' or it is already local.": "Imagem remota não encontrada em '{p}' ou já é local.",

  "Single image download failed: {p}": "Falha no download de imagem única: {p}",

  "The attachment folder {p} does not exist!": "A pasta de anexos {p} não existe!",

  "The note was renamed to {p}": "A nota foi renomeada para {p}",

  "This command cannot run on vault's root or on subfolder next to note!\nPlease, change settings first!\r\n": "Este comando não pode ser executado na raiz do vault ou em subpasta ao lado da nota!\nPor favor, altere as configurações primeiro!\r\n",

  "This command requires the settings 'Next to note in the folder specified below' and pattern '${notename}' at the end to be enabled, also the path cannot contain ${date} pattern.\nPlease, change settings first!\r\n": "Este comando requer as configurações 'Ao lado da nota na pasta especificada abaixo' e o padrão '${notename}' no final habilitado, também o caminho não pode conter o padrão ${date}.\nPor favor, altere as configurações primeiro!\r\n",

  "WARNING!\r\nAttachments for \'{p}\' were processed, but some attachments were not downloaded/replaced...": "AVISO!\r\nAnexos para \'{p}\' foram processados, mas alguns anexos não foram baixados/substituídos...",

  "{p} attachments for note {p} were processed.": "{p} anexos para a nota {p} foram processados.",
};