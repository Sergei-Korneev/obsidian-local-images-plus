export const en = {
  processCanvas: "Process Canvas files",
  processCanvasDesc: "Process images in Obsidian Canvas (.canvas files)",
  urlExcludeRegexps: "URL exclude regexps",
  urlExcludeRegexpsDesc: "One per line: regexps to exclude URLs when downloading. Examples:\n^https://example\\.com/.*\n.*ads\\..*",
  useMarkdownAngle: "Use markdown link format with angle brackets ![](<link>)",
  useMarkdownAngleDesc: "Force using markdown link format with angle brackets instead of encoded URI when generating links.",
  downloadUnknown: "Download unknown filetypes",
  downloadUnknownDesc: "Download unknown filetypes and save them with .unknown extension.",
  fileNameTemplate: "File name template",
  fileNameTemplateDesc: "Template for new attachment names. Variables: ${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}. Default: ${md5}_MD5 (backward compatible). Examples: ${originalname}, ${notename}-${originalname}, ${date}-${md5:8}. Use Folder to save new attachments for subfolders.",
  fileNameTemplateError: "File name template cannot contain path separators. Use 'Folder to save new attachments' to set subfolders."
};
export default en;
