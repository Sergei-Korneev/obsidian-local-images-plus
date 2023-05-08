import path from "path";
import { fromBuffer } from "file-type";
import isSvg from "is-svg";
import filenamify from "filenamify";

import {
  FORBIDDEN_SYMBOLS_FILENAME_PATTERN,
  VERBOSE,
  MD_LINK,
  USER_AGENT,

} from "./config";

import {
  requestUrl
} from "obsidian";

import md5 from "crypto-js/md5";
//import fs from "fs";
const fs = require('fs').promises;

/*
https://stackoverflow.com/a/48032528/1020973
It will be better to do it type-correct.

*/
//const fs = require('fs').promises;





export function logError(str: any, isObj: boolean = false) {
  if (VERBOSE) {
    if (isObj) {
      console.table(str);
    }
    else {
      console.log(str);
    }
  }
};

export function md5Sig(contentData: ArrayBuffer = undefined) {

  try {

    var dec = new TextDecoder("utf-8");
    const arrMid = Math.round(contentData.byteLength / 2);
    const chunk = 15000;
    const signature = md5([
      contentData.slice(0, chunk),
      contentData.slice(arrMid, arrMid + chunk),
      contentData.slice(-chunk)
    ].map(x => dec.decode(x)).join()
    ).toString();

    return signature + "_MD5";
  }
  catch (e) {

    logError("Cannot generate md5: " + e, false);
    return null;
  }

}


export async function replaceAsync(str: any, regex: Array<RegExp>, asyncFn: any) {

  logError("replaceAsync: str: " + str + ' regex: ' + regex, false);

  let errorflag = false;
  const promises: Promise<any>[] = [];
  let dictPatt: Array<any>[] = [];
  let link;
  let anchor;
  let replp: any;
  let caption = "";

  regex.forEach((element) => {
    logError(element);
    const matches = str.matchAll(element);

    for (const match of matches) {
      anchor = match.groups.anchor;
      link = (match.groups.link.match(MD_LINK) ?? [match.groups.link])[0];
      caption = trimAny((match.groups.link.match(MD_LINK) !== null ?
        (match.groups.link.split(link).length > 1 ?
          match.groups.link.split(link)[1] : "") :
        ""), [")", "]", "(", "[", " "]);
      link = trimAny(link, [")", "(", "]", "[", " "]);
      replp = trimAny(match[0], ["[", "(", "]"]);

      logError("repl: " + replp +
        "\r\nahc: " + anchor +
        "\r\nlink: " + link +
        "\r\ncaption: " + caption);

      dictPatt[replp] = [anchor, link, caption];

    };

  })

  for (var key in dictPatt) {
    const promise = asyncFn(key, dictPatt[key][0], dictPatt[key][1], dictPatt[key][2]);
    logError(promise, true);
    promises.push(promise);
  }

  const data = await Promise.all(promises);
  logError("Promises: ");
  logError(data, true);
  //  return str.replace((reg: RegExp, str: String) => { 

  data.forEach((element) => {

    if (element !== null) {

      logError("el: " + element[0] + "  el2: " + element[1]);
      str = str.replaceAll(element[0], element[1]);
    }
    else {
      errorflag = true;
    }

  });

  return [str, errorflag];

  //  return str.replace( () => data.shift());
}

export function isUrl(link: string) {
  logError("IsUrl: " + link, false);
  try {
    return Boolean(new URL(link));
  } catch (_) {
    return false;
  }
}



export async function copyFromDisk(src: string, dest: string): Promise<null> {
  logError("copyFromDisk: " + src + " to " + dest, false);
  try {
    await fs.copyFile(src, dest, null, (err) => {
      if (err) {
        logError("Error:" + err, false);
      }

    });
  }
  catch (e) {
    logError("Cannot copy: " + e, false);
    return null;
  }
}




export async function base64ToBuff(data: string): Promise<ArrayBuffer> {
  logError("base64ToBuff: \r\n", false);
  try {
    const BufferData = Buffer.from(data.split("base64,")[1], 'base64');
    logError(BufferData);
    return BufferData;
  }
  catch (e) {

    logError("Cannot read base64: " + e, false);
    return null;
  }
}


export async function readFromDisk(file: string): Promise<ArrayBuffer> {
  logError("readFromDisk: " + file, false);
  try {
    const data = await fs.readFile(file, null);
    //const data = await app.vault.adapter.readBinary(path.relative(app.vault.adapter.basePath, file));
    return Buffer.from(data);
  }
  catch (e) {

    logError("Cannot read the file: " + e, false);
    return null;
  }
}

export async function downloadImage(url: string): Promise<ArrayBuffer> {

  logError("Downloading: " + url, false);
  const headers = {
    'method': 'GET',
    'User-Agent': USER_AGENT
  }

  try {
    const res = await requestUrl({ url: url, headers })
    logError(res, true);
    return res.arrayBuffer;
  }
  catch (e) {

    logError("Cannot download the file: " + e, false);
    return null;
  }
}

export async function fileExtByContent(content: ArrayBuffer) {

  const fileExt = (await fromBuffer(content))?.ext;

  // if XML, probably it is SVG
  if (fileExt == "xml" || !fileExt) {
    const buffer = Buffer.from(content);
    if (isSvg(buffer)) return "svg";
  }

  return fileExt;
}


//https://stackoverflow.com/questions/26156292/trim-specific-character-from-a-string

export function trimAny(str: string, chars: Array<string>) {
  var start = 0,
    end = str.length;

  while (start < end && chars.indexOf(str[start]) >= 0)
    ++start;

  while (end > start && chars.indexOf(str[end - 1]) >= 0)
    --end;

  return (start > 0 || end < str.length) ? str.substring(start, end) : str;
}


export function cFileName(name: string) {
  const cleanedName = name.replace(
    /(\)|\(|\"|\'|\#|\]|\[|\:|\>|\<|\*|\|)/g,
    " "
  );
  return cleanedName;
}

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
