import { URL } from "url";
import path from "path";
import { 
  App, 
  DataAdapter,
  TFile,
  Plugin
} from "obsidian";


import {
  isUrl,
  downloadImage,
  readFromDisk,
  cleanFileName,
  logError,
  trimAny,
  pathJoin,
  normalizePath,
  base64ToBuff,
  md5Sig,
  getFileExt,
  blobToJpegArrayBuffer
} from "./utils";

import{
  ISettings,
  SUPPORTED_OS
} from "./config";


import AsyncLock from "async-lock";
import moment from "moment";

export function imageTagProcessor(app: Plugin,
                                  noteFile: TFile,
                                  settings: ISettings,
                                  defaultdir: boolean
                                 ) {
                                  
  const unique = Math.random().toString(16).slice(2,);

  async function processImageTag(match: string,
                                 anchor: string,
                                 link: string,
                                 caption: string,
                                 imgsize: string) {


   logError("processImageTag: "+match) 
    if (!isUrl(link)) {
      return match;
    }

    try {

      var lock = new AsyncLock();
      let fpath;
      let fileData: ArrayBuffer; 
      const opsys = process.platform;
      const mediaDir = await getMDir(app.app, noteFile, settings, defaultdir, unique);
      await app.ensureFolderExists(mediaDir);
      const protocol=link.slice(0,5);

      if (protocol == "data:"){
         logError("ReadBase64: \r\n"+fpath, false);
         fileData = await  base64ToBuff(link);
      } 
      else 

      if (protocol == "file:")  
        {
         logError("Readlocal: \r\n"+fpath, false);
          if (SUPPORTED_OS.win.includes(opsys)) {fpath=link.replace("file:///",""); }
          else if (SUPPORTED_OS.unix.includes(opsys)) { fpath=link.replace("file://",""); }
          else { fpath=link.replace("file://",""); }

             fileData = await readFromDisk(fpath);
             if ( fileData === null ) {
                   fileData = await readFromDisk(decodeURI(fpath));}
        }
        else{
            //Try to download several times
            let trycount  = 0;
            while (trycount < settings.tryCount){ 
                fileData = await downloadImage(link);
                logError("\r\n\nDownloading (try): "+trycount+"\r\n\n");
                if (fileData !== null){break;}
                trycount++;
            }
        }
         if ( fileData  === null ){
            logError("Cannot get an attachment content!", false);
            return null;
         }

         
         if( Math.round(fileData.byteLength/1024) < settings.filesizeLimit) {
            logError("Lower limit of the file size!", false);
            return null;
         }

        try {
     

  const { fileName, needWrite } = await lock.acquire(match, async function() {

  
    const parsedUrl = new URL(link);
     
    let fileExt = await getFileExt(fileData, parsedUrl.pathname);
   

 
    if (fileExt == "png" && settings.PngToJpeg) {
 
      const blob = new Blob([new Uint8Array(fileData)]);
      fileData = await blobToJpegArrayBuffer(blob, settings.JpegQuality*0.01)

      logError("arbuf: ")
      logError(fileData)
    }
          const { fileName, needWrite } = await chooseFileName(
            app.app.vault.adapter,
            mediaDir,
            link,
            fileData,
            settings
          );
          return {fileName, needWrite};
    });



          if (needWrite && fileName) {
            await app.app.vault.createBinary(fileName, fileData);
          }

          if (fileName) {
            
                let shortName = "";
                const rdir = await getRDir(noteFile, settings, fileName, link);
                let pathWiki = rdir[0];
                let pathMd = rdir[1];
                   

          if (settings.addNameOfFile  && protocol == "file:") {

                        if (!app.app.vault.getConfig("useMarkdownLinks")) {

                                 shortName = "\r\n[[" +
                                 fileName +
                                   "\|" +
                                 rdir[2]["lnkurid"]  + "]]\r\n";
                        }
                        else
                          {
                                 shortName = "\r\n[" +
                                 rdir[2]["lnkurid"]  +
                                 "](" +
                                 rdir[2]["pathuri"] +
                                    ")\r\n";
                          }
                }

              if (!app.app.vault.getConfig("useMarkdownLinks")){
                
                // image caption
                (!settings.useCaptions || !caption.length) ? caption="" : caption="\|"+caption;
                
                // image size has higher priority
                (!settings.useCaptions || !imgsize.length) ? caption="" : caption="\|"+imgsize;

                 return  [match, `![[${pathWiki}${caption}]]`, `${shortName}`];
              }
              
              else{
                ( !settings.useCaptions || !caption.length ) ? caption="" : caption=" "+caption;
                 return [match,`![${anchor}](${pathMd}${caption})`, `${shortName}`];
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


 


export async function getRDir(
                              noteFile: TFile,
                              settings: ISettings,
                              fileName: string,
                              link: string = undefined):
                              Promise<Array<any>>{
    let pathWiki = "";
    let pathMd = "";

    const notePath = normalizePath(noteFile.parent.path);
    const parsedPath = path.parse(normalizePath(fileName));
    
    const parsedPathE = {
        parentd: path.basename(parsedPath["dir"]),
        basen: (parsedPath["name"]+parsedPath["ext"]),
        lnkurid: path.basename(decodeURI(link)),
        pathuri:  encodeURI(normalizePath(fileName))
      };



  switch (settings.pathInTags) {
    case "baseFileName":
      pathWiki = pathMd = parsedPathE["basen"];
      break;
    case "onlyRelative":
      pathWiki =  pathJoin([path.relative(path.sep + notePath, path.sep + parsedPath["dir"]),parsedPathE["basen"]]);
      pathMd = encodeURI(pathWiki);
      break;
    case "fullDirPath":
      pathWiki = fileName.replace(/\\/g, "/");
      pathMd = parsedPathE["pathuri"];
      break;
    default:
      pathWiki = fileName;
      pathMd = parsedPathE["pathuri"];
  };
return [pathWiki, pathMd, parsedPathE];

}


export async function getMDir(app: App,
                              noteFile: TFile,
                              settings: ISettings,
                              defaultdir: boolean = false,
                              unique: string = ""): Promise<string>{


    const notePath = noteFile.parent.path;
    const date = new Date();
    const current_date = moment().format(settings.DateFormat); 
    const obsmediadir = app.vault.getConfig("attachmentFolderPath");
    const mediadir = settings.mediaRootDir;
    var attdir = settings.saveAttE;
    if (defaultdir) { attdir  = ""};
    let root="/";




          switch (attdir) {
            
            case 'inFolderBelow':
               root = mediadir
               .replace("${notename}", noteFile.basename)
               .replace("${unique}", unique)
               .replace("${date}", current_date);
              break;

            case 'nextToNoteS':
               root = (pathJoin([noteFile.parent.path,mediadir]))
               .replace("${notename}", noteFile.basename)
               .replace("${unique}", unique)
               .replace("${date}", current_date);
              break;

            default:
            
            if ( obsmediadir === '/' ){
                  root = obsmediadir;
            }
            else if ( obsmediadir === './' ){
                  root = pathJoin([noteFile.parent.path]);
            }
            else if  ( obsmediadir.match (/\.\/.+/g) !== null ) {
                  root = pathJoin([noteFile.parent.path, obsmediadir.replace('\.\/','')]);
            }
            else{
                  root = normalizePath(obsmediadir);
            }

          }

return trimAny(root,["/","\\"]);
}

async function chooseFileName(
  adapter: DataAdapter,
  dir: string,
  link: string,
  contentData: ArrayBuffer,
  settings: ISettings
): Promise<{ fileName: string; needWrite: boolean }> {
  const parsedUrl = new URL(link);
  const ignoredExt = settings.ignoredExt.split("|");
  let fileExt = await getFileExt(contentData, parsedUrl.pathname);
  logError("file: "+link+" content: "+contentData+" file ext: "+fileExt,false);
  

 
  if (fileExt == "unknown" && !settings.downUnknown) {
    return { fileName: "", needWrite: false };
    }
  

  if (ignoredExt.includes(fileExt)) {
    return { fileName: "", needWrite: false };
  }

  // Use MD5 only if the setting is enabled, otherwise use original filename
  let baseName: string;
  if (settings.useMD5ForNewAtt) {
    baseName = md5Sig(contentData);
  } else {
    // Extract original filename from URL, clean it, and remove extension
    const originalName = path.basename(parsedUrl.pathname);
    const nameWithoutExt = path.parse(originalName).name || 'attachment';
    baseName = cleanFileName(nameWithoutExt);
  }

  let needWrite = true;
  let fileName = "";
  const suggestedName = pathJoin([dir, cleanFileName(`${baseName}`+`.${fileExt}`)]);
    if (await adapter.exists(suggestedName, false)) {
      const fileData = await adapter.readBinary(suggestedName);
      const existing_file_md5 = md5Sig(fileData);
      const current_file_md5 = md5Sig(contentData);
      
      if (existing_file_md5 === current_file_md5) {
        fileName = suggestedName;
        needWrite = false;
      } else {
        // File exists but content is different, generate unique name
        if (settings.useMD5ForNewAtt) {
          fileName = pathJoin([dir, cleanFileName(Math.random().toString(9).slice(2,) +`.${fileExt}`)]);
        } else {
          fileName = pathJoin([dir, cleanFileName(`${baseName}_${Math.random().toString(9).slice(2,)}.${fileExt}`)]);
        }
      }
    } else {
      fileName = suggestedName;
    }

  logError("File name: "+ fileName,false);
  if (!fileName) {
    throw new Error("Failed to generate file name for media file.");
  }

  return { fileName, needWrite };
}}
