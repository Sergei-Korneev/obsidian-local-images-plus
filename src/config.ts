export const APP_TITLE = "Local Images Plus  0.16.1";




//Option to enable debugging

let VERBOSE = false;

function setDebug(value: boolean = false){
    VERBOSE =  value;
}


export {VERBOSE, setDebug};




export const SUPPORTED_OS = {"win":"win32","unix":"linux,darwin,freebsd,openbsd"};

export const USER_AGENT =
'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82  Safari/537.36';

export const HTML_EMBED =
//html embedded image
/(?<htmlem>\[{0,1}\<img.+?(?<src>src=.+?)\>)/gm

export const ANCHOR_S = /(?<anchor>.+)\|(?<size>[0-9]+)/g

export const MD_SEARCH_PATTERN =
[
//file link
/\!\[(?<anchor>(.{0}|(?!^file\:\/)+?))\]\((?<link>((file\:\/)[^\!]+?(\.{1}.{3,4}\) {0,1}|\)$|\)\n|\)])))/gm,
//hypertext link
///\!\[(?<anchor>(.{0}|[^\[]+?))\]\((?<link>((http(s){0,1}).+?(\) |\..{3,4}\)|\)$|\)\n|\)\]|\)\[)))/gm,
 
/\!\[(?<anchor>([^\]]*))\]\((?<link>((http(s){0,1}).+?(\) |\..{3,4}\)|\)$|\)\n|\)\]|\)\[)))/gm,

//Base64 encoded data
/\!\[[^\[](?<anchor>(.{0}|[^\[]+?))\]\((?<link>((data\:.+?base64\,).+?(\) |\..{3,4}\)|\)$|\)\n|\)\]|\)\[)))/gm,
/\!\[(?<anchor>(.{0}|[^\[]+?))\]\((?<link>((http(s){0,1}|(data\:.+?base64\,)).+?\)))/gm
]


export const MD_LINK = 
/\http(s){0,1}.+?( {1}|\)\n)/g;


export const ANY_URL_PATTERN =
/[a-zA-Z\d]+:\/\/(\w+:\w+@)?([a-zA-Z\d.-]+\.[A-Za-z]{2,4})(:\d+)?(\/.*)?/i;

export const ATT_SIZE_ACHOR = 
/(^(?<attdesc>.{1,})\|(?<attsize>[0-9]{2,4})$)|(?<attsize2>^[0-9]{2,4}$)/gm



// Looks like timeouts in Obsidian API are set in milliseconds
export const NOTICE_TIMEOUT = 5 * 1000;
export const TIMEOUT_LIKE_INFINITY = 24 * 60 * 60 * 1000;
export const FORBIDDEN_SYMBOLS_FILENAME_PATTERN = /\s+/g;

export interface ISettings {
  processCreated: boolean,
  ignoredExt: string,
  processAll: boolean,
  useCaptions: boolean,
  pathInTags: string,
  downUnknown: boolean,
  saveAttE: string,
  realTimeUpdate: boolean;
  filesizeLimit: number,
  tryCount: number,
  realTimeUpdateInterval: number;
  addNameOfFile: boolean;
  showNotifications: boolean;
  includeps: string;
  includepattern: string;
  mediaRootDir: string;
  disAddCom: boolean;
  useMD5ForNewAtt: boolean;
  removeMediaFolder: boolean;
  removeOrphansCompl: boolean;
  PngToJpeg: boolean;
  PngToJpegLocal: boolean;
  JpegQuality: number;
  DoNotCreateObsFolder: boolean;
  DateFormat: string
}

export const DEFAULT_SETTINGS: ISettings = {
  processCreated: true,
  ignoredExt: "cnt|php|htm|html",
  processAll: true,
  useCaptions: true,
  pathInTags: "fullDirPath",
  downUnknown: false,
  saveAttE: "obsFolder",
  realTimeUpdate: true,
  filesizeLimit: 0,
  tryCount: 2,
  realTimeUpdateInterval: 5,
  addNameOfFile: true,
  showNotifications: true,
  includeps: "md|canvas",
  includepattern: "(?<md>.*\\.md)|(?<canvas>.*\\.canvas)",
  mediaRootDir: "_resources/${notename}",
  disAddCom: false,
  useMD5ForNewAtt: true,
  removeMediaFolder: true,
  removeOrphansCompl: false,
  PngToJpeg: false,
  PngToJpegLocal: true,
  JpegQuality: 80,
  DoNotCreateObsFolder: false,
  DateFormat: "YYYY MM DD"
};
