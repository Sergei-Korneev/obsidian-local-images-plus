export const VERBOSE = false;

export const SUPPORTED_OS = {"win":"win32","unix":"linux,darwin,freebsd,openbsd"};

export const USER_AGENT =
'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.89 Safari/537.36';
export const MD_MEDIA_LINK= 
/(?<anchor>.{0,1}\!\[.+\()(?<link>(http(s){0,1}|file).+[^\)])\)/g;

export const MD_SEARCH_PATTERN=
[
//file link
/\!\[(?<anchor>(.{0}|.+?))\]\((?<link>((file\:\/).+?(\.{1}.{3,4}\) {0,1}|\)$|\)\n|\)])))/g,
//hypertext link
/\!\[(?<anchor>(.{0}|.+?))\]\((?<link>((http(s){0,1}).+?(\) |\..{3,4}\)|\)$|\)\n|\)\]|\)\[)))/gm
]

export const MD_LINK = 
/\http(s){0,1}.+?( {1}|\)\n)/g;
///\http(s){0,1}.+?(\..{3,4}\?{1}| {1}|\))/g;


export const ANY_URL_PATTERN =
/[a-zA-Z\d]+:\/\/(\w+:\w+@)?([a-zA-Z\d.-]+\.[A-Za-z]{2,4})(:\d+)?(\/.*)?/i;

// Looks like timeouts in Obsidian API are set in milliseconds
export const NOTICE_TIMEOUT = 15 * 1000;
export const TIMEOUT_LIKE_INFINITY = 24 * 60 * 60 * 1000;
export const FORBIDDEN_SYMBOLS_FILENAME_PATTERN = /\s+/g;

export interface ISettings {
  useCaptions: boolean,
  useRelativePath: boolean,
  mediaFolderSuff: string,
  downUnknown: boolean,
  saveAtt: string,
  realTimeUpdate: boolean;
  filesizeLimit: number,
  realTimeUpdateInterval: number;
  addNameOfFile: boolean;
  showNotifications: boolean;
  include: string;
  mediaRootDirectory: string;
  useWikilinks: boolean;
}

export const DEFAULT_SETTINGS: ISettings = {
  useCaptions: true,
  useRelativePath: false,
  mediaFolderSuff: "|_res",
  downUnknown: false,
  saveAtt: "obsFolder",
  realTimeUpdate: false,
  filesizeLimit: 0,
  realTimeUpdateInterval: 5,
  addNameOfFile: true,
  showNotifications: true,
  include: ".*\\.md",
  mediaRootDirectory: "_resources",
  useWikilinks: false,
};
