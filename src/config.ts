export const VERBOSE = false;
export const SUPPORTED_OS = {"win":"win32","unix":"linux,darwin,freebsd,openbsd"};
export const USER_AGENT ='Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:57.0) Gecko/20100101 Firefox/106.0';
export const MD_MEDIA_LINK= 
/(?<anchor>.{0,1}\!\[.+\()(?<link>(htt(p|s)|file).+[^\)])\)/g;
export const MD_MEDIA_EMBED = 
/(?<anchor>\!\[.+\()(?<link>(http[s]{0,1}|file).*)/g;
export const MD_ANCHOR = 
/\!\[(?<anchor>.*?)\]/g;
export const MD_LINK = 
/\((?<link>(htt(p|s).+?[ |\)]{1}|file.+\){1}))/g;


export const ANY_URL_PATTERN =
/[a-zA-Z\d]+:\/\/(\w+:\w+@)?([a-zA-Z\d.-]+\.[A-Za-z]{2,4})(:\d+)?(\/.*)?/i;

// Looks like timeouts in Obsidian API are set in milliseconds
export const NOTICE_TIMEOUT = 10 * 1000;
export const TIMEOUT_LIKE_INFINITY = 24 * 60 * 60 * 1000;
export const FORBIDDEN_SYMBOLS_FILENAME_PATTERN = /\s+/g;

export interface ISettings {
  saveAttNextToNote: boolean,
  realTimeUpdate: boolean;
  realTimeUpdateInterval: number;
  addNameOfFile: boolean;
  showNotifications: boolean;
  include: string;
  mediaRootDirectory: string;
  useWikilinks: boolean;
}

export const DEFAULT_SETTINGS: ISettings = {
  saveAttNextToNote: false,
  realTimeUpdate: false,
  realTimeUpdateInterval: 2,
  addNameOfFile: true,
  showNotifications: true,
  include: ".*\\.md",
  mediaRootDirectory: "_resources",
  useWikilinks: true,
};
