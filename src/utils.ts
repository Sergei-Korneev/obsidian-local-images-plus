import path from "path";
//import axios from 'axios';
//import got, {Options} from 'got';
import { fromBuffer } from "file-type";
import isSvg from "is-svg";
import filenamify from "filenamify";
import { 
  FORBIDDEN_SYMBOLS_FILENAME_PATTERN,
  VERBOSE,
  MD_MEDIA_LINK, 
  MD_LINK,
  USER_AGENT
} from "./config";
import {
  requestUrl
} from 'obsidian';

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


export async function replaceAsync(str: any, regex: Array<RegExp>, asyncFn: any) {
  logError("replaceAsync: str: " + str + ' regex: ' + regex, false);
  let errorflag=false;
  const promises: Promise<any>[] = [];
  let link;
  let anchor;
  let replp: any;
  let link_;
  let dictPatt: Array<any>[] = [];

  regex.forEach((element) => {
      logError(element);
        const  matches =  str.matchAll(element);

    for (const match of matches) {
                  link = match.groups.link;
                  link_=link.match(MD_LINK); 
                  if (link_ !== null){
                        link=link_[0];
                  }
                  link=trimAny(link,[")","(","]","["," "])
                  anchor = match.groups.anchor;
                  replp=trimAny(match[0],["[","(","]"]);

                logError("repl: "+replp+
                "\r\nahc: "+ anchor+ 
                "\r\nlink: "+ link +
                "link repl: "+link.match(MD_LINK));


                dictPatt[replp]=[anchor,link];




  };

})

  for (var key in dictPatt){
         const promise = asyncFn(key, dictPatt[key][0],  dictPatt[key][1]);
         logError(promise,true);
         promises.push(promise);
  }

const data = await Promise.all(promises);
  logError("Promises: ");
  logError(data,true);
//  return str.replace((reg: RegExp, str: String) => { 
    
data.forEach((element) => {

  if (element !== null){
    
    logError("el: "+element[0]+"  el2: "+element[1]);
    str =  str.replaceAll(element[0],element[1]);
  }
  else{
    errorflag=true;
  }

});

return [str,errorflag];

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
const headers = {
     'method': 'GET',
     'User-Agent':USER_AGENT
}

//
//    const config = {
//        method: 'get',
//        url: url,
//        headers: {
//          'User-Agent':' Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.89 Safari/537.36',
////'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
////'HTTPS':'1',
////'DNT':'1',
////'Referer':'https://www.usanews.com/',
////'Accept-Language': 'en-US,en;q=0.8,en-GB;q=0.6,es;q=0.4',
////'Access-Control-Allow-Origin':'app://obsidian.md',
////'Cache-Control': 'max-age=0',
//        }
//    }
//
//
//
//    let res = await axios(config)
//    
//  })
//const options = {
//	headers: {
// 'Host': 'usnews.com',
//
// 'Cache-Control': 'max-age=0',
// 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
// 'HTTPS': '1',
// 'DNT': '1',
// 'Referer': 'https://www.google.com/',
// 'Accept-Language': 'en-US,en;q=0.8,en-GB;q=0.6,es;q=0.4',
// 'If-Modified-Since': 'Thu, 23 Jul 2015 20:31:28 GMT',
// 
//		'User-Agent':' Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.89 Safari/537.36',
//   // 'method': 'GET',
//	},
// // http2: true,
////  retry: {
////		limit: 5,
////		errorCodes: [
////			'ETIMEDOUT'
////		],
////	},
////	timeout: {
////	request: 10000,
////	},
//};
//
//
//
try {
    const res = await requestUrl({url: url, headers})
    logError(res,true);
    return res.arrayBuffer;
  }
catch(e){

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


//https://stackoverflow.com/questions/26156292/trim-specific-character-from-a-string

export function trimAny(str: string, chars: Array<string>) {
    var start = 0, 
        end = str.length;

    while(start < end && chars.indexOf(str[start]) >= 0)
        ++start;

    while(end > start && chars.indexOf(str[end - 1]) >= 0)
        --end;

    return (start > 0 || end < str.length) ? str.substring(start, end) : str;
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
