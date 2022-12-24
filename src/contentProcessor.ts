import { URL } from "url";
import path from "path";

import { App, DataAdapter } from "obsidian";

import {
  isUrl,
  downloadImage,
  readFromDisk,
  fileExtByContent,
  cleanFileName,
  pathJoin,
} from "./utils";
import {
  FILENAME_TEMPLATE,
  MAX_FILENAME_INDEX,
  FILENAME_ATTEMPTS,
} from "./config";
import { linkHashes } from "./linksHash";

export function imageTagProcessor(app: App, mediaDir: string, useWikilinks: boolean) {
  async function processImageTag(match: string, anchor: string, link: string) {
    ////console.log("processImageTag: "  + match +"  "+ anchor +"  "+ link);
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
          if (opsys == "win32")  {fpath=link.replace("file:///","");}
          if (opsys == "linux" || opsys == "darwin" )  {fpath=link.replace("file://","");}
          fileData = await readFromDisk(fpath);
        }
        else{
           fileData = await downloadImage(link);
        }

      // when several images refer to the same file they can be partly
      // failed to download because file already exists, so try to resuggest filename several times
      let attempt = 0;
      while (attempt < FILENAME_ATTEMPTS) {
        try {
          const { fileName, needWrite } = await chooseFileName(
            app.vault.adapter,
            mediaDir,
            anchor,
            link,
            fileData
          );

          if (needWrite && fileName) {
            await app.vault.createBinary(fileName, fileData);
          }

          if (fileName) {
              if (useWikilinks) {
                 return `![[${fileName}]]`;
              }
              else{
                 return `![${anchor}](${fileName})`;
              }
          } else {
            return match;
          }
        } catch (error) {
          if (error.message === "File already exists.") {
            attempt++;
          } else {
            throw error;
          }
        }
      }
      return match;
    } catch (error) {
      console.warn("Image processing failed: ", error);
      return match;
    }
  }

  return processImageTag;
}

async function chooseFileName(
  adapter: DataAdapter,
  dir: string,
  baseName: string,
  link: string,
  contentData: ArrayBuffer
): Promise<{ fileName: string; needWrite: boolean }> {



  const parsedUrl = new URL(link);


  // If node's package file-type fucked up try to get extension from url (is not this obvious?)
  let fileExt = path.extname(parsedUrl.pathname).replace("\.","");


  if (!fileExt) {
      fileExt = await fileExtByContent(contentData);
  }
  
  // ////console.log(fileExt);
  //  if (!fileExt) {
  //    return { fileName: "", needWrite: false };
  //}


  baseName = path.basename(parsedUrl.pathname)

  if (!baseName) {
        baseName = Math.random().toString(9).slice(2,);
  }

   baseName=cleanFileName(baseName.replace(`.${fileExt}`,""))


  let fileName = "";
  let needWrite = true;
  let index = 0;
  while (!fileName && index < MAX_FILENAME_INDEX) {
    const suggestedName = index
      ? pathJoin(dir, `${baseName}-${index}.${fileExt}`)
      : pathJoin(dir, `${baseName}.${fileExt}`);

    if (await adapter.exists(suggestedName, false)) {
      linkHashes.ensureHashGenerated(link, contentData);

      const fileData = await adapter.readBinary(suggestedName);

      if (linkHashes.isSame(link, fileData)) {
        fileName = suggestedName;
        needWrite = false;
      }
    } else {
      fileName = suggestedName;
    }

    index++;
  }
  if (!fileName) {
    throw new Error("Failed to generate file name for media file.");
  }

  linkHashes.ensureHashGenerated(link, contentData);

  return { fileName, needWrite };
}
