import path, { resolve } from "path";
import { fromBuffer } from "file-type";
import isSvg from "is-svg";
import md5 from "crypto-js/md5";
const fs2 = require('fs').promises;
import fs from "fs";


import {
  USER_AGENT,
  NOTICE_TIMEOUT,
  APP_TITLE,
  VERBOSE,
  SUPPORTED_OS,
  ATT_SIZE_ACHOR,
  MD_LINK
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

export function md5Sig(contentData: ArrayBuffer|Buffer = undefined) {

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


export function MarkdownLinkParser(match: RegExp | string): any {

  let link: string, anchor: string, replp: any, caption = "", AttSize = "";
  const keypart = match.groups?.keypart;
  const q1 = match.groups?.q1;
  const q2 = match.groups?.q2;
  const isWikiEmbed = match[0].includes("![[");

  logError("Match: " + match)

  anchor = CtagsBrcks(match.groups?.anchor ?? "");


  for (const attmatch of anchor.matchAll(ATT_SIZE_ACHOR)) {
    AttSize = (attmatch.groups.attsize !== undefined) ? CtagsBrcks(attmatch.groups.attsize) :
      (attmatch.groups.attsize2 !== undefined) ? CtagsBrcks(attmatch.groups.attsize2) :
        "";
  }

  //a wikilink embed carries no alt text: the anchor must stay empty in markdown output mode
  if (isWikiEmbed) { anchor = ""; }

  link = CtagsBrcks(match.groups.link.match(MD_LINK)?.[0] ?? match.groups.link)
  const protocol = link.slice(0, 5)
  caption = CtagsBrcks(MD_LINK.test(match.groups.link) ? (match.groups.link.split(link)[1] ?? "") : "");
  //keep the exact match text for frontmatter keys and wiki brackets: replaceAll searches for it literally
  replp = (keypart !== undefined || isWikiEmbed) ? match[0] : trimAny(match[0], ["[", "(", "]"])

  if (protocol == "file:") {
    SUPPORTED_OS.win.includes(process.platform) ? link.replace("file:///", "") :
      SUPPORTED_OS.unix.includes(process.platform) ? link.replace("file://", "") :
        link.replace("file://", "")
    const parsedPath = path.parse(link)
    link = parsedPath.dir + "/" + parsedPath.name + trimTags(parsedPath.ext)
  }

  logError({ replp: replp, anchor: anchor, link: link, protocol: protocol, caption: caption, AttSize: AttSize, keypart: keypart }, true);

  return { replp: replp, anchor: anchor, link: link, protocol: protocol, caption: caption, AttSize: AttSize, keypart: keypart, q1: q1, q2: q2 };

}


export async function replaceAsync(str: any, regex: Array<RegExp>, asyncFn: any) {

  logError("replaceAsync: \r\nstr: " + str + "\r\nregex: ")
  logError(regex, true);

  let errorflag = false;
  const promises: Promise<any>[] = [];
  let filesArr: Array<string> = [];
  const seen = new Set<string>();


  regex.forEach((regex_pattern) => {
    //a shared /g regex may keep lastIndex from an earlier .test() call
    regex_pattern.lastIndex = 0;
    const matches = str.matchAll(regex_pattern);
    for (const match of matches) {
      const ReplaceObj = MarkdownLinkParser(match);
      logError(ReplaceObj);
      //the same match text can be produced by several patterns: download it only once
      if (seen.has(ReplaceObj.replp)) { continue; }
      seen.add(ReplaceObj.replp);
      const promise = asyncFn(ReplaceObj);
      logError(promise, true);
      promises.push(promise);
    }

  }
  )


  const data = await Promise.all(promises);
  logError("Promises: ");
  logError(data, true);
  //  return str.replace((reg: RegExp, str: String) => { 

  const replaced = new Set<string>();
  data.forEach((element) => {

    if (Array.isArray(element)) {
      if (replaced.has(element[0])) { return; }
      replaced.add(element[0]);
      logError("Replacing " + element[0] + " to " + element[1]);
      str = str.replaceAll(element[0], element[1]);
      //the bare tag is what the metadata cache reports as an embed (no frontmatter key)
      filesArr.push((element[2] !== undefined && element[2] !== "") ? element[2] : element[1]);
    }
    else if (element === null) {
      errorflag = true;
    }
  }

  );

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

export async function base64ToBuff(data: string): Promise<ArrayBuffer> {
  logError("base64ToBuff: \r\n", false);
  try {
    const BufferData = Buffer.from(data.split("base64,")[1], 'base64');
    logError(BufferData);
    return bufferToArrayBuffer(BufferData);
     
  }
  catch (e) {

    logError("Cannot read base64: " + e, false);
    return null;
  }
}

export async function readFromDiskB(file: string, count: number = undefined): Promise<ArrayBuffer> {

  try {
    const buffer = Buffer.alloc(count);
    const fd: number = fs.openSync(file, "r+")
    fs.readSync(fd, buffer, 0, buffer.length, 0)
    logError(buffer)
    fs.closeSync(fd)
    return bufferToArrayBuffer(buffer)

  } catch (e) {
    logError("Cannot read the file: " + e, false);
    return null
  }



}

export async function readFromDisk(file: string): Promise<ArrayBuffer> {
  logError("readFromDisk: " + file, false);

  try {
    const data = await fs2.readFile(file, null);
    return bufferToArrayBuffer(Buffer.from(data));
  }
  catch (e) {

    logError("Cannot read the file: " + e, false);
    return null;
  }
}

export async function downloadImage(url: string, referer: string = ""): Promise<ArrayBuffer> {

  logError("Downloading: " + url + " referer: " + referer, false);
  const headers = {
    'method': 'GET',
    'User-Agent': USER_AGENT,
    'Referer': referer
  }

  try {
    const res = await requestUrl({ url: url, headers })
    logError(res, true);
    //requestUrl may resolve instead of throwing on 4xx/5xx: never treat an error page as an image
    if (!(res.status >= 200 && res.status < 300)) {
      logError("HTTP status " + res.status + " for " + url, false);
      return null;
    }
    if (res.arrayBuffer == null || res.arrayBuffer.byteLength == 0) {
      return null;
    }
    return res.arrayBuffer;
  }
  catch (e) {
    logError("Cannot download the file: " + e, false);
    return null;
  }
}

function bufferToArrayBuffer(buffer: Buffer): ArrayBuffer {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}


export async function getFileExt(content: ArrayBuffer, link: string) {

  const fileExtByLink = path.extname(link).replace("\.", "");
  const fileExtByBuffer = (await fromBuffer(content))?.ext;

  // if XML, probably it is SVG
  if (fileExtByBuffer == "xml" || !fileExtByBuffer) {
    const buffer = Buffer.from(content);
    if (isSvg(buffer)) return "svg";
  }


  logError("fileExtByBuffer" + fileExtByBuffer)

  if (fileExtByBuffer != undefined && fileExtByBuffer && fileExtByBuffer.length <= 5 && fileExtByBuffer?.length > 0) {
    return fileExtByBuffer;
  }

  logError("fileExtByLink  " + fileExtByLink)

  if (fileExtByLink != undefined && fileExtByLink.length <= 5 && fileExtByLink?.length > 0) {
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


export function CtagsBrcks(str: string) {
  return trimAny(str, [")", "(", "]", "[", " "]);
}

export function CtagsWhS(str: string) {
  return trimAny(str, [" "]);
}

export function cFileName(name: string, sep: string = " ") {
  const cleanedName = name.replace(
    /(\)|\(|\"|\'|\#|\]|\[|\:|\>|\<|\*|\|)/g,
    sep
  );
  return cleanedName;
}

export function trimTags(link: string){
  return link.split(/[#?&\s]+/)[0];
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




/**
 * https://github.com/mnaoumov/obsidian-dev-utils (modified)
 * @param blob - The Blob object to convert.
 * @param imgQuality - The quality of the image (0 to 1).
 * @returns A promise that resolves to an ArrayBuffer.
 */
export async function blobToJpegArrayBuffer(Data: ArrayBuffer, imgQuality: number, imgType: string): Promise<ArrayBuffer> {
 
 try {
  const blob = new Blob([new Uint8Array(Data)]);
  imgType = (imgType.length == 0) ? "image/jpeg": imgType;
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = (): void => {
      const image = new Image();
      image.onload = (): void => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('Could not get 2D context.');
        }
        const imageWidth = image.width;
        const imageHeight = image.height;
        let data = '';

        canvas.width = imageWidth;
        canvas.height = imageHeight;

        context.fillStyle = '#fff';
        context.fillRect(0, 0, imageWidth, imageHeight);
        context.save();

        context.translate(imageWidth / 2, imageHeight / 2);
        context.drawImage(image, 0, 0, imageWidth, imageHeight, -imageWidth / 2, -imageHeight / 2, imageWidth, imageHeight);
        context.restore();

        data = canvas.toDataURL(imgType, imgQuality);

        const arrayBuffer = base64ToBuff(data);
        resolve(arrayBuffer);
      };

      image.src = reader.result as string;
    };
    reader.readAsDataURL(blob);
  });

    }
  catch (e) {
    logError("Cannot compress: " + e, false);
    return null;
  }
}

