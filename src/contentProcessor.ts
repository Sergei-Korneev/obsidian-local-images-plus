import { URL } from "url";
import path from "path";
import { App, DataAdapter } from "obsidian";
import md5 from 'crypto-js/md5';
import {
  isUrl,
  downloadImage,
  readFromDisk,
  fileExtByContent,
  cleanFileName,
  logError,
  pathJoin,
} from "./utils";

import{
  MD_MEDIA_LINK, 
  MD_MEDIA_EMBED,
  MD_ANCHOR,
  MD_LINK,
  SUPPORTED_OS
} from "./config";


//import AsyncLock from "async-lock";
 // var lock = new AsyncLock();

export function imageTagProcessor(app: App,
                                  mediaDir: string,
                                  useWikilinks: boolean,
                                  addNameofFile: boolean) {
  async function processImageTag(match: string,
                                 anchor: string,
                                 link: string) {
    
    if (!isUrl(link)) {
      return match;
    }

    try {

      let fpath;
      let fileData; 
      const opsys = process.platform;
      const protocol=link.slice(0,7);
      if (protocol == "file://")  
        {
         logError("Readlocal: \r\n"+fpath, false);
          if (SUPPORTED_OS.win.includes(opsys)) {fpath=link.replace("file:///",""); }
          else if (SUPPORTED_OS.unix.includes(opsys)) { fpath=link.replace("file://",""); }
          else { fpath=link.replace("file://",""); }
             fileData = await readFromDisk(fpath);
        }
        else{
           fileData = await downloadImage(link);
        }
         if ( fileData  === null ){
            logError("Cannot get an attachment content!", false);
            return match;
         }
        try {
     
          const { fileName, needWrite } = await chooseFileName(
            app.vault.adapter,
            mediaDir,
            link,
            fileData
          );

          if (needWrite && fileName) {
            await app.vault.createBinary(fileName, fileData);
          }

          if (fileName) {
           let  shortName = ""
          if (addNameofFile  && protocol == "file://") {
               shortName = "**"+path.basename(decodeURI(link))+"**\r\n";
          }

             let   fileNameURI= encodeURI(fileName);
            if (useWikilinks) {

                 return `${shortName}![[${fileName}]]`;
              }
              else{
                 return `${shortName}![${anchor}](${fileNameURI})`;
              }
          } else {
            return match;
          }
        } catch (error) {
          if (error.message === "File already exists.") {
          } else {
            throw error;
          }
        }
      
      return match;
    } catch (error) {
      logError("Image processing failed: " + error, false);
      return match;
    }
  }

  return processImageTag;
}



async function chooseFileName(
  adapter: DataAdapter,
  dir: string,
  link: string,
  contentData: ArrayBuffer
): Promise<{ fileName: string; needWrite: boolean }> {
  const parsedUrl = new URL(link);

  // If node's package file-type fucked up try to get extension from url (is not this obvious?)
  let fileExt = path.extname(parsedUrl.pathname).replace("\.","");
  logError("file: "+link+" content: "+contentData,false);

  if (fileExt.length > 4 )
      {
          fileExt=fileExt.match(/((http|file|https).+?(\.jpg|\.jpeg|\.gif|\.svg|\)|\)))/g)[0].toString();
      }

  if (!fileExt) {
      fileExt = await fileExtByContent(contentData);
  }
  
  if (!fileExt) {
    fileExt = "unknown";
    //return { fileName: "", needWrite: false };
  }

  logError("File Ext: "+fileExt, false);
  var enc = new TextDecoder("utf-8");
  const baseName =  md5(enc.decode(contentData.slice(0, 15000))).toString() ;
  let needWrite = true;
  let fileName = "";
  const suggestedName = pathJoin(dir, cleanFileName(`${baseName}`+"_MD5"+`.${fileExt}`));
    if (await adapter.exists(suggestedName, false)) {
      const fileData = await adapter.readBinary(suggestedName);
            const existing_file_md5 = md5(enc.decode(fileData.slice(0,15000))).toString() ;
            if (existing_file_md5 === baseName){
              fileName = suggestedName;
              needWrite = false;
            }
            else{
              fileName =  pathJoin(dir, cleanFileName( Math.random().toString(9).slice(2,) +`.${fileExt}`));
            }

    } else {
      fileName = suggestedName;
    }

  logError("Fileneame: "+ fileName,false);
  if (!fileName) {
    throw new Error("Failed to generate file name for media file.");
  }

  //linkHashes.ensureHashGenerated(link, contentData);

  return { fileName, needWrite };
}
