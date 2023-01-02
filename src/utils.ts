import path from "path";
import got from "got";
import { fromBuffer } from "file-type";
import isSvg from "is-svg";
import filenamify from "filenamify";
import { 
  FORBIDDEN_SYMBOLS_FILENAME_PATTERN,
  VERBOSE,
  MD_MEDIA_LINK, 
  MD_MEDIA_EMBED,
  MD_ANCHOR,
  MD_LINK,
  USER_AGENT
} from "./config";

/*
https://stackoverflow.com/a/48032528/1020973
It will be better to do it type-correct.

*/
const fs = require('fs').promises;

export function logError(str: any, isObj: boolean =  false){
    if (VERBOSE){
      if (isObj){
        console.table(str);
      }
      else{
        console.log(str);
      }
    }
};


export async function replaceAsync(str: any, regex: any, asyncFn: any) {
  logError("replaceAsync: str: " + str + ' regex: ' + regex, false);
  const promises: Promise<any>[] = [];
  str.replace(regex, (match: string, ...args: any) => {
    
    logError("Match: " + match, false);

                  let link;
                  let anchor;
                  let link2;
                  let rr;

    try{
                   link = match.match(MD_MEDIA_LINK)[0].match(MD_MEDIA_EMBED)[0].match(MD_LINK)[0].replace(/(\)$|^\()/g, '');
                   anchor = match.match(MD_MEDIA_LINK)[0].match(MD_MEDIA_EMBED)[0].match(MD_ANCHOR)[0].replace(/(\]$|^\!\[)/g, '');
                   rr={anc:anchor,lnk:link,repl:`![${anchor}](${link})`};

                  if (link){
//                  link2 = link[1].replace(/(\)$|^\()/g, '');
                  }
        }
        catch(e){
              logError("Error in regex: "+e,false);
        }

    logError(rr, true);
    const promise = asyncFn(rr.repl, rr.anc, rr.lnk);

    logError(promise,true);
    promises.push(promise);
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
}

export function isUrl(link: string) {
  logError("IsUrl: " + link, false);
  try {
    return Boolean(new URL(link));
  } catch (_) {
    return false;
  }
}

export async function readFromDisk(file: string): Promise<ArrayBuffer> {
    logError("readFromDisk: " + file, false);
try {
    //   const data = await this.app.vault.adapter.readBinary(file);
    const data = await fs.readFile(file, null);
    return Buffer.from(data);
}
catch(e)
{

  logError("Cannot read the file: "+ e,false);
    return null;
}
}

export async function downloadImage(url: string): Promise<ArrayBuffer> {

logError("Downloading: " + url, false);
try {
  const res = await  got(url,
                         {responseType: 'buffer',
                          method: 'GET',
                          retry: 2,
                          timeout: 10000,
                          maxRedirects: 5,
                          headers: {
                            'User-Agent': USER_AGENT,
                           // 'Accept-Language': 'en-US,en;q=0.5',
                          },
                          });  
  return res.body;
}
catch(e)
{

  logError("Cannot download the file: "+ e,false);
    return null;
}
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
