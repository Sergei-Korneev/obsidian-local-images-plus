export const APP_TITLE = "Local Images Plus  0.17.0";




//Option to enable debugging

let VERBOSE = false;

function setDebug(value: boolean = false){
    VERBOSE =  value;
}

export {VERBOSE, setDebug};




export const SUPPORTED_OS = {"win":"win32","unix":"linux,darwin,freebsd,openbsd"};

export const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82  Safari/537.36';

//html embedded image
export const HTML_EMBED = /(?<htmlem>\[{0,1}\<img.+?(?<src>src=.+?)\>)/gm

export const ANCHOR_S = /(?<anchor>.+)\|(?<size>[0-9]+)/g

const MD_CORE_SEARCH_PATTERN =
[
//file link
/\!\[(?<anchor>(.{0}|(?!^file\:\/)+?))\]\((?<link>((file\:\/)[^\!]+?(\.{1}.{3,4}\) {0,1}|\)$|\)\n|\)])))/gm,

//hypertext link
//\!\[(?<anchor>([^\]]*))\]\((?<link>((http(s){0,1}).+?(\) |\..{3,4}\)|\)$|\)\n|\)\]|\)\[)))/gm,
/\!\[(?<anchor>([^\]]*))\]\((?<link>((http(s){0,1}\:).+?(\) |\..{3,4}\)|\)$|\)\n|\)\]|\)\[|\/[^(]+?\))))/gm,

//Base64 encoded data
/\!\[[^\[](?<anchor>(.{0}|[^\[]+?))\]\((?<link>((data\:.+?base64\,).+?(\) |\..{3,4}\)|\)$|\)\n|\)\]|\)\[)))/gm,
/\!\[(?<anchor>(.{0}|[^\[]+?))\]\((?<link>((http(s){0,1}|(data\:.+?base64\,)).+?\)))/gm,

]

//wikilink embed with remote url: ![[https://host/path.png]] or ![[https://host/path.png|300]]
const WIKILINK_SEARCH_PATTERN =
/\!\[\[(?<anchor>(?<link>https?:\/\/[^\]\|]+)(?:\|[^\]\|]*)?)\]\]/gm

const SOURCE_KEY_EXCLUSION = "(?!(?:[sS][oO][uU][rR][cC][eE])[ \\t]*:)"

//frontmatter value that is an embed: cover: ![[https://...]] or cover: "![[https://...]]"
const FM_EMBED_SEARCH_PATTERN =
new RegExp(
  "^(?<keypart>[ \\t]*" + SOURCE_KEY_EXCLUSION + "[^\\s:#'\"][^:\\r\\n]*?[ \\t]*:[ \\t]*)" +
  "(?<q1>['\"]?)!\\[\\[(?<anchor>(?<link>https?:\\/\\/[^\\]\\|]+)(?:\\|[^\\]\\|]*)?)\\]\\](?<q2>['\"]?)",
  "gm"
)

//frontmatter value that is a bare url with a media extension: hero: "https://host/img.jpg"
const FM_BARE_URL_SEARCH_PATTERN =
new RegExp(
  "^(?<keypart>[ \\t]*" + SOURCE_KEY_EXCLUSION + "[^\\s:#'\"][^:\\r\\n]*?[ \\t]*:[ \\t]*)" +
  "(?<anchor>)(?<q1>['\"]?)" +
  "(?<link>https?:\\/\\/[^\\s'\"]+\\.(?:png|jpe?g|gif|webp|svg|avif|bmp|tiff?|ico|pdf|epub|mp3|mp4|m4a|ogg|wav|webm|mov|docx?|xlsx?|pptx?|zip)(?:[?#][^\\s'\"]*)?)" +
  "(?<q2>['\"]?)",
  "gm"
)

export const CANVAS_BARE_URL_PATTERN = /"(?<link>https?:\/\/[^\s"'{}\[\]]+\.(?:png|jpe?g|gif|webp|svg|avif|bmp|tiff?|ico|pdf|epub|mp3|mp4|m4a|ogg|wav|webm|mov|docx?|xlsx?|pptx?|zip)(?:[?#][^\s"'{}\[\]]*)?)"/gm;
export const MD_SEARCH_PATTERN = [...MD_CORE_SEARCH_PATTERN, WIKILINK_SEARCH_PATTERN]

//patterns for the frontmatter part of a note (local links stay untouched)
export const FRONTMATTER_DOWNLOAD_PATTERN =
[FM_EMBED_SEARCH_PATTERN, FM_BARE_URL_SEARCH_PATTERN, ...MD_CORE_SEARCH_PATTERN]


export const FRONTMATTER_SEARCH_PATTERN =
[
/\[{2}(?<urllink>((http(s){0,1}).+?(\) |\..{3,4}\]{2}|\]{2}|\]{2}$|\]{2}\n)))/g,
/\[{2}(?<loclink>(.+?(\) |\..{3,4}\]{2}|\]{2}|\]{2}$|\]{2}\n)))/g,
]

export const MD_LINK = /\http(s){0,1}.+?( {1}|\)\n)/g;

export const URL_PATTERN = /^(https?:\/\/)?[^\/]+/g;

export const ANY_URL_PATTERN = /[a-zA-Z\d]+:\/\/(\w+:\w+@)?([a-zA-Z\d.-]+\.[A-Za-z]{2,4})(:\d+)?(\/.*)?/i;

export const ATT_SIZE_ACHOR = /(^(?<attdesc>.{1,})\|(?<attsize>[0-9]{2,4})$)|(?<attsize2>^[0-9]{2,4}$)/gm

export const TIME_DIFF = 500;

// Looks like timeouts in Obsidian API are set in milliseconds
export const NOTICE_TIMEOUT = 5 * 1000;
export const TIMEOUT_LIKE_INFINITY = 24 * 60 * 60 * 1000;
 
export interface ISettings {
  processCreated: boolean,
  ignoredExt: string,
  processAll: boolean,
  processFrontmatter: boolean,
  useCaptions: boolean,
  pathInTags: string,
  downUnknown: boolean,
  saveAttE: string,
  realTimeUpdate: boolean;
  filesizeLimit: number,
  tryCount: number,
  realTimeUpdateInterval: number;
  showNotifications: boolean;
  contextMenuDownload: boolean;
  includeps: string;
  includepattern: string;
  mediaRootDir: string;
  disAddCom: boolean;
  FileNameTemplate: string;
  removeMediaFolder: boolean;
  removeOrphansCompl: boolean;
  PngToJpeg: boolean;
  PngToJpegLocal: boolean;
  JpegQuality: number;
  DoNotCreateObsFolder: boolean;
  DateFormat: string;
  ImgCompressionType:string;
  ExcludedFoldersList:string;
  ExcludedFoldersListRegexp: string;
  useMarkdownLinkFormat: boolean;
  processCanvas: boolean;
  UrlExcludeRegexps: string;
}

export const DEFAULT_SETTINGS: ISettings = {
  processCreated: true,
  ignoredExt: "cnt|php|htm|html",
  processAll: true,
  processFrontmatter: true,
  useCaptions: true,
  pathInTags: "fullDirPath",
  downUnknown: false,
  saveAttE: "obsFolder",
  realTimeUpdate: true,
  filesizeLimit: 0,
  tryCount: 2,
  realTimeUpdateInterval: 5,
  showNotifications: true,
  contextMenuDownload: true,
  includeps: "md|canvas",
  includepattern: "(?<md>.*\\.md)|(?<canvas>.*\\.canvas)",
  mediaRootDir: "_resources/${notename}",
  disAddCom: false,
  FileNameTemplate: "${md5}_MD5",
  removeMediaFolder: true,
  removeOrphansCompl: false,
  PngToJpeg: false,
  PngToJpegLocal: true,
  JpegQuality: 80,
  DoNotCreateObsFolder: false,
  DateFormat: "YYYY MM DD",
  ImgCompressionType: "image/jpeg",
  ExcludedFoldersList: "",
  ExcludedFoldersListRegexp: "",
  useMarkdownLinkFormat: false,
  processCanvas: true,
  UrlExcludeRegexps: ""
};
