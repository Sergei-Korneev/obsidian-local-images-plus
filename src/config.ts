export const EXTERNAL_MEDIA_LINK_PATTERN =
// /\!\[(?<anchor>.+)\]\((?<link>.+)\)/g;
 /\!\[(?<anchor>[^\]\(]{0,})\]\((?<link>[^\)]{0,})\)/g;

 // /\!\[(?<anchor>.+?)\]\((?<url>(htt(p|s)|file).+?(\.mp4|\.jpeg|\.jpg))/g;

//recursive  regex
 //(?<anchor>.{0,1}\!\[.+\()(?<link>(htt(p|s)|file).+[^\)])\)

export const SUPPORTED_OS = {"win":"win32","unix":"linux,darwin,freebsd,openbsd"};

//export const DIRTY_IMAGE_TAG = /\[\!\[\[(?<anchor>.*?)\]\]\((?<link>.+?)\)\]/g;

export const ANY_URL_PATTERN =
/[a-zA-Z\d]+:\/\/(\w+:\w+@)?([a-zA-Z\d.-]+\.[A-Za-z]{2,4})(:\d+)?(\/.*)?/i;

// Looks like timeouts in Obsidian API are set in milliseconds
export const NOTICE_TIMEOUT = 10 * 1000;

export const TIMEOUT_LIKE_INFINITY = 24 * 60 * 60 * 1000;

export const FORBIDDEN_SYMBOLS_FILENAME_PATTERN = /\s+/g;

export interface ISettings {
  realTimeUpdate: boolean;
  realTimeUpdateInterval: number;
  realTimeAttemptsToProcess: number;
  //cleanContent: boolean;
  showNotifications: boolean;
  include: string;
  mediaRootDirectory: string;
  useWikilinks: boolean;
}

export const DEFAULT_SETTINGS: ISettings = {
  realTimeUpdate: false,
  realTimeUpdateInterval: 1,
  realTimeAttemptsToProcess: 3,
  //cleanContent: true,
  showNotifications: true,
  include: ".*\\.md",
  mediaRootDirectory: "_resources",
  useWikilinks: true,
};
