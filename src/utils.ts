import path, { resolve } from "path";
import { fromBuffer } from "file-type";
import isSvg from "is-svg";
import filenamify from "filenamify";
import Jimp from "jimp";
import md5 from "crypto-js/md5";
const fs2 = require('fs').promises;
import fs from "fs";
 

// Jimp buffer package fix
// https://github.com/Sergei-Korneev/obsidian-local-images-plus/issues/47


Buffer.isBuffer = (e) => {
  
  return (
    (e != null  && e != undefined) && ( 
      (Object.getPrototypeOf(e) instanceof Uint8Array && typeof e.constructor.isBuffer == "function" )  
    )
    
    )

}

 

import {
  FORBIDDEN_SYMBOLS_FILENAME_PATTERN,
  MD_LINK,
  USER_AGENT,
  NOTICE_TIMEOUT,
  APP_TITLE,
  VERBOSE

} from "./config";

import {
  requestUrl,
  Notice,
  TFile
} from "obsidian";
 

//import { TIMEOUT } from "dns";
//import fs from "fs";





/*
https://stackoverflow.com/a/48032528/1020973
It will be better to do it type-correct.

*/


export async function showBalloon(str: string, show: boolean = true, timeout = NOTICE_TIMEOUT) {
  if (show) {
    new Notice(APP_TITLE + "\r\n" + str, timeout);
  };
}


export function displayError(error: Error | string, file?: TFile): void {
  if (file) {
    showBalloon(`LocalImagesPlus: Error while handling file ${file.name}, ${error.toString()}`);
  } else {
    showBalloon(error.toString());
  }

  logError(`LocalImagesPlus: error: ${error}`, false);
}

export async function logError(str: any, isObj: boolean = false) {

  if (VERBOSE) {

    console.log(APP_TITLE + ":  ");

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

  logError("replaceAsync: \r\nstr: " + str + "\r\nregex: ")
  logError(regex, true);

  let errorflag = false;
  const promises: Promise<any>[] = [];
  let dictPatt: Array<any>[] = [];
  let link;
  let anchor;
  let replp: any;
  let caption = "";
  let filesArr: Array<string> = [];

  regex.forEach((element) => {
    logError("cur regex:  " + element);
    const matches = str.matchAll(element);

    for (const match of matches) {
      logError("match: ")
      logError(match)

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

      logError("el: " + element[0] + "  el2: " + element[1] + element[2]);
      str = str.replaceAll(element[0], element[1] + element[2]);
      filesArr.push(element[1]);
    }
    else {
      errorflag = true;
    }

  });

  return [str, errorflag, filesArr];

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
    await fs.copyFile(src, dest, null, (err: Error) => {
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



export async function pngToJpeg(buffer: ArrayBuffer, quality: number = 100): Promise<Buffer | null> {

  let buf: Buffer | void
  buf = await Jimp.read(Buffer.from(buffer, 0, buffer.byteLength))
    .then(async (image) => {

      image
        .quality(quality) // set JPEG quality
      //return buffer;
      buf = (await image.getBufferAsync(Jimp.MIME_JPEG)); // save
      return buf
    })
    .catch((e) => {
      // Handle an exception.
      logError("Cannot convert to jpeg: " + e, false);
      return null
    });

  if (buf instanceof Buffer) {
    return buf;

  } else {
    return null
  };

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

export async function readFromDiskB(file: string, count: number = undefined): Promise<Buffer> {

  try {

    const buffer = Buffer.alloc(count);
    const fd: number = fs.openSync(file, "r+")
    fs.readSync(fd, buffer, 0, buffer.length, 0)
    logError(buffer)
    fs.closeSync(fd)
    return buffer

  } catch (e) {
    logError("Cannot read the file: " + e, false);
    return null
  }



}


export async function readFromDisk(file: string): Promise<ArrayBuffer> {
  logError("readFromDisk: " + file, false);

  try {
    const data = await fs2.readFile(file, null);
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

export async function getFileExt(content: ArrayBuffer, link: string) {

  const fileExtByLink = path.extname(link).replace("\.", "");
  const fileExtByBuffer = (await fromBuffer(content))?.ext;

  // if XML, probably it is SVG
  if (fileExtByBuffer == "xml" || !fileExtByBuffer) {
    const buffer = Buffer.from(content);
    if (isSvg(buffer)) return "svg";
  }

  if (fileExtByBuffer && fileExtByBuffer.length <= 5 && fileExtByBuffer?.length > 0) {
    return fileExtByBuffer;
  }


  if (fileExtByLink && fileExtByLink.length <= 5 && fileExtByBuffer?.length > 0) {
    return fileExtByLink;
  }

  return "unknown";
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

export function pathJoin(parts: Array<string>): string {
  const result = path.join(...parts);
  // it seems that obsidian do not understand paths with backslashes in Windows, so turn them into forward slashes
  return result.replace(/\\/g, "/");
}

export function normalizePath(path: string) {
  return path.replace(/\\/g, "/");

}

export function encObsURI(e: string) {
  return e.replace(/[\\\x00\x08\x0B\x0C\x0E-\x1F ]/g, (function (e) {
    return encodeURIComponent(e)
  }
  ))
}

export interface DateFormat {
  pattern: string;
  parse(source: string): Date | null;
  format(date: Date | string | number): string;
}

export function SimpleDateFormat(pattern: string): DateFormat {
  const fmt: DateFormat = {
    pattern,
    parse(source: string): Date | null {
      try {
        return new Date(source);
      } catch (e) {
        console.log("string to date error: " + source);
        return null;
      }
    },
    format(date: Date | string | number): string {
      if (typeof date === "undefined" || date === null || date === "") {
        return "";
      }
      
      let dateObj: Date;
      try {
        dateObj = new Date(date);
      } catch (e) {
        console.log("date format error: " + date);
        return "";
      }
      
      let strTime = this.pattern;
      const o = {
        "M+": dateObj.getMonth() + 1,
        "d+": dateObj.getDate(),
        "H+": dateObj.getHours(),
        "m+": dateObj.getMinutes(),
        "s+": dateObj.getSeconds(),
        "q+": Math.floor((dateObj.getMonth() + 3) / 3),
        "S": dateObj.getMilliseconds()
      };
      
      if (/(y+)/.test(strTime)) {
        strTime = strTime.replace(RegExp.$1, (dateObj.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      
      for (const k in o) {
        if (new RegExp("(" + k + ")").test(strTime)) {
          strTime = strTime.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
      }
      
      return strTime;
    }
  };
  
  return fmt;
}

export function formatStrPath(root: string, reg: RegExp, date: Date | string | number): string {
  let res: RegExpExecArray | null;
  let flag = false;
  let resStr = root;
  const tempReg = new RegExp(reg.source, "i"); 

  while (res = reg.exec(root)) {
    if (!flag) {
      flag = true;
    }

    const formatStr = res[1];
    const fmt = SimpleDateFormat(formatStr);
    const dataStr = fmt.format(date);
    resStr = resStr.replace(tempReg, dataStr);
  }
  return flag ? resStr : root;
}