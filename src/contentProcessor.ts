import { URL } from "url";
import path from "path";
import { App, DataAdapter } from "obsidian";
import {
  isUrl,
  downloadImage,
  readFromDisk,
  fileExtByContent,
  cleanFileName,
  logError,
  pathJoin,
  md5Sig,
} from "./utils";

import{
  MD_MEDIA_LINK, 
  MD_LINK,
  SUPPORTED_OS
} from "./config";


//import AsyncLock from "async-lock";
 // var lock = new AsyncLock();

export function imageTagProcessor(app: App,
                                  mediaDir: string,
                                  useWikilinks: boolean,
                                  addNameofFile: boolean,
                                  sizeLim: Number,
                                  downUnknown: boolean,
                                  useRelativePath: boolean,
                                  useCaptions: boolean
                                 ) {

  async function processImageTag(match: string,
                                 anchor: string,
                                 link: string,
                                 caption: string) {


   logError("processImageTag: "+match) 
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
            return null;
         }

         
         if( Math.round(fileData.byteLength/1024) < sizeLim) {
            logError("Lower limit of the file size!", false);
            return null;
         }

        try {
     
          const { fileName, needWrite } = await chooseFileName(
            app.vault.adapter,
            mediaDir,
            link,
            fileData,
            downUnknown
          );

          if (needWrite && fileName) {
            await app.vault.createBinary(fileName, fileData);
          }

          if (fileName) {
           
              let baseFilename = path.basename(fileName);
              let fileNameURI = encodeURI(fileName);
              let fileNameW = fileName; 
              let  shortName = "";

                  if(useRelativePath){
                      fileNameURI = fileNameW = baseFilename;
                  }


          if (addNameofFile  && protocol == "file://") {

                        if (useWikilinks) {

                                 shortName = "\r\n[[" +
                                 fileName +
                                   "\|" +
                                     path.basename(decodeURI(link)) + "]]\r\n";
                        }
                        else
                          {
                                 shortName = "\r\n[" +
                                 path.basename(decodeURI(link)) +
                                 "](" +
                                 fileNameURI +
                                    ")\r\n";
                          }
                }

              if (useWikilinks){
                (!useCaptions || !caption.length) ? caption="" : caption="\|"+caption;
                 return  [match, `![[${fileNameW}${caption}]]${shortName}`];
              }
              
              else{
                ( !useCaptions || !caption.length ) ? caption="" : caption=" "+caption;
                 return [match,`![${anchor}](${fileNameURI}${caption})${shortName}`];
              }



          } else {
            return null;
          }

        } catch (error) {
          if (error.message === "File already exists.") {
          } else {
            throw error;
          }
        }
      
      return null;
    } catch (error) {
      logError("Image processing failed: " + error, false);
      return null;
    }
  }

  return processImageTag;
}



async function chooseFileName(
  adapter: DataAdapter,
  dir: string,
  link: string,
  contentData: ArrayBuffer,
  downUnknown: boolean
): Promise<{ fileName: string; needWrite: boolean }> {
  const parsedUrl = new URL(link);

  let fileExt = path.extname(parsedUrl.pathname).replace("\.","");
  logError("file: "+link+" content: "+contentData+" file ext: "+fileExt,false);

  if (!fileExt) {
      fileExt = await fileExtByContent(contentData);
  }
  
  if (!fileExt) {
    fileExt = "unknown";

  if (!downUnknown) {
    return { fileName: "", needWrite: false };
    }
  }

  logError("File Ext: "+fileExt, false);
  
  const baseName =  md5Sig(contentData);

  let needWrite = true;
  let fileName = "";
  const suggestedName = pathJoin(dir, cleanFileName(`${baseName}`+"_MD5"+`.${fileExt}`));
    if (await adapter.exists(suggestedName, false)) {
      const fileData = await adapter.readBinary(suggestedName);
            const existing_file_md5 = md5Sig(fileData);
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
