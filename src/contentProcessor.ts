import { URL } from "url";
import path from "path";
import { 
  App, 
  DataAdapter,
  TFile
} from "obsidian";


import {
  isUrl,
  downloadImage,
  readFromDisk,
  fileExtByContent,
  cleanFileName,
  logError,
  trimAny,
  pathJoin,
  md5Sig,
} from "./utils";

import{
  MD_MEDIA_LINK, 
  MD_LINK,
  ISettings,
  SUPPORTED_OS
} from "./config";


import AsyncLock from "async-lock";
 



export function imageTagProcessor(app: App,
                                  noteFile: TFile,
                                  settings: ISettings,
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

     var lock = new AsyncLock();
      let fpath;
      let fileData: ArrayBuffer; 
      const opsys = process.platform;
      const mediaDir = await getMDir(app, noteFile, settings);

    const protocol=link.slice(0,7);


      if (protocol == "file://")  
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
           fileData = await downloadImage(link);
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


          const { fileName, needWrite } = await chooseFileName(
            app.vault.adapter,
            mediaDir,
            link,
            fileData,
            settings.downUnknown
          );
          return {fileName, needWrite};
    });



          if (needWrite && fileName) {
            await app.vault.createBinary(fileName, fileData);
          }

          if (fileName) {
            
                let shortName = "";
                const rdir = await getRDir(noteFile, settings, fileName, link);
                let pathWiki = rdir[0];
                let pathMd = rdir[1];
                   

          if (settings.addNameOfFile  && protocol == "file://") {

                        if (settings.useWikilinks) {

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

              if (settings.useWikilinks){
                (!settings.useCaptions || !caption.length) ? caption="" : caption="\|"+caption;
                 return  [match, `![[${pathWiki}${caption}]]${shortName}`];
              }
              
              else{
                ( !settings.useCaptions || !caption.length ) ? caption="" : caption=" "+caption;
                 return [match,`![${anchor}](${pathMd}${caption})${shortName}`];
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

    const notePath = noteFile.parent.path.replace(/\\/g, "/");
    const parsedPath = path.parse(fileName.replace(/\\/g, "/"));
    
    const parsedPathE = {
        parentd: path.basename(parsedPath["dir"]),
        basen: (parsedPath["name"]+parsedPath["ext"]),
        lnkurid: path.basename(decodeURI(link)),
        pathuri:  encodeURI(fileName.replace(/\\/g, "/"))
      };



  switch (settings.pathInTags) {
    case "baseFileName":
      pathWiki = pathMd = parsedPathE["basen"];
      break;
    case "onlyRelative":
      pathWiki = path.join(path.relative(path.sep + notePath, path.sep + parsedPath["dir"]),parsedPathE["basen"]).replace(/\\/g, "/");
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
                              settings: ISettings): Promise<string>{


    const notePath = noteFile.parent.path;
    const date = new Date();
    const current_date = date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear();
    const obsmediadir = app.vault.getConfig("attachmentFolderPath");
    const mediadir = settings.mediaRootDir;
    const attdir = settings.saveAttE;
    let root="/";




          switch (attdir) {
            
            case 'inFolderBelow':
               root = mediadir.replace("${notename}", noteFile.basename).replace("${date}", current_date);
              break;

            case 'nextToNoteS':
               root = (path.join(noteFile.parent.path,mediadir)).replace("${notename}", noteFile.basename).replace("${date}", current_date);
              break;

            default:
            
            if ( obsmediadir === '/' ){
                  root = obsmediadir;
            }
            else if ( obsmediadir === './' ){
                  root = path.join(noteFile.parent.path);
            }
            else if  ( obsmediadir.match (/\.\/.+/g) !== null ) {
                  root = path.join(noteFile.parent.path, obsmediadir.replace('\.\/',''));
            }
            else{
                  root = obsmediadir;
            }

          }

return trimAny(root,["/","\\"]);


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
  const suggestedName = pathJoin(dir, cleanFileName(`${baseName}`+`.${fileExt}`));
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

  logError("File name: "+ fileName,false);
  if (!fileName) {
    throw new Error("Failed to generate file name for media file.");
  }

  //linkHashes.ensureHashGenerated(link, contentData);

  return { fileName, needWrite };
}
