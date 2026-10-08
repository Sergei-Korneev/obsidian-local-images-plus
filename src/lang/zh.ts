export const zh = {
  processCanvas: "处理 Canvas 文件",
  processCanvasDesc: "处理 Obsidian Canvas (.canvas) 中的图片",
  urlExcludeRegexps: "URL 排除正则表达式",
  urlExcludeRegexpsDesc: "每行一个：下载时排除匹配的 URL 正则表达式。示例：\n^https://example\\.com/.*\n.*ads\\..*",
  useMarkdownAngle: "使用带尖括号的 Markdown 链接 ![](<链接>)",
  useMarkdownAngleDesc: "生成带尖括号的 Markdown 链接 ![](<链接>)，不对 URI 进行编码",
  downloadUnknown: "下载未知文件类型",
  downloadUnknownDesc: "下载未知类型的文件并保存为 .unknown",
  fileNameTemplate: "文件名模板",
  fileNameTemplateDesc: "新附件的文件名模板。变量：${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}。默认：${md5}_MD5。示例：${originalname}, ${notename}-${originalname}, ${date}-${md5:8}。子文件夹请使用“附件保存文件夹”设置。",
  fileNameTemplateError: "文件名模板不能包含路径分隔符。要使用子文件夹，请在“附件保存文件夹”中设置。"
};
export default zh;
