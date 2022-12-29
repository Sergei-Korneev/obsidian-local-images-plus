import path from "path";
import got from "got";
import { fromBuffer } from "file-type";
import isSvg from "is-svg";
import filenamify from "filenamify";
import { 
  DIRTY_IMAGE_TAG,
  FORBIDDEN_SYMBOLS_FILENAME_PATTERN 
} from "./config";
/*
https://stackoverflow.com/a/48032528/1020973
It will be better to do it type-correct.

*/
const fs = require('fs').promises;

export async function replaceAsync(str: any, regex: any, asyncFn: any) {
  console.log("replaceAsync: str: " + str + ' regex: ' + regex);
  const promises: Promise<any>[] = [];
  str.replace(regex, (match: string, ...args: any) => {
    console.log("Match: " + match);
    const promise = asyncFn(match, ...args);
    promises.push(promise);
  });
  const data = await Promise.all(promises);

//    console.log("Replaced:  " + str.replace(regex, () => data.shift()) );
  return str.replace(regex, () => data.shift());
}

export function isUrl(link: string) {
  console.log("IsUrl: " + link);
  try {
    return Boolean(new URL(link));
  } catch (_) {
    return false;
  }
}



export async function readFromDisk(file: string): Promise<ArrayBuffer> {
    console.log("readFromDisk: " + file );
    const data = await fs.readFile(file, null);
    return Buffer.from(data);
}

export async function downloadImage(url: string): Promise<ArrayBuffer> {

console.log("Downloading: " + url );
  const res = await  got(url,
                         {responseType: 'buffer',
                          method: 'GET',
                          retry: 3,
                          timeout: 45000,
                          maxRedirects: 5,
                          headers: {
                            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:57.0) Gecko/20100101 Firefox/106.0',
                            'Accept-Language': 'en-US,en;q=0.5',
                          },
                          });  
  return res.body;
}

export async function fileExtByContent(content: ArrayBuffer) {

  const fileExt = (await fromBuffer(content))?.ext;

  // if XML, probably it is SVG
  if (fileExt == "xml") {
    const buffer = Buffer.from(content);
    if (isSvg(buffer)) return "svg";
  }

  return fileExt;
}

//function recreateImageTag(match: string, anchor: string, link: string) {
//
//console.log("recreateImageTag: " +  match + anchor + link);
//  return `![${anchor}](${link})`;
//}
//
//export function cleanContent(content: string) {
//  const cleanedContent = content.replace(DIRTY_IMAGE_TAG, recreateImageTag);
//  return cleanedContent;
//}
//
export function cleanFileName(name: string) {
  const cleanedName = filenamify(name).replace(
    FORBIDDEN_SYMBOLS_FILENAME_PATTERN,
    "_"
  );
  return cleanedName;
}

export function pathJoin(dir: string, subpath: string): string {
  const result = path.join(dir, subpath);
  // it seems that obsidian do not understand paths with backslashes in Windows, so turn them into forward slashes
  return result.replace(/\\/g, "/");
}
