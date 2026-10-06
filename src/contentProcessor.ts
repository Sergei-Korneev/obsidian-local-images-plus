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
  cFileName,
  logError,
  trimAny,
  CtagsBrcks,
  CtagsWhS,
  pathJoin,
  normalizePath,
  base64ToBuff,
  md5Sig,
  getFileExt,
  blobToJpegArrayBuffer,
  trimTags,
  showBalloon
} from "./utils";

import {
  ISettings,
  SUPPORTED_OS,
  ATT_SIZE_ACHOR,
  MD_LINK,
  URL_PATTERN,
  NOTICE_TIMEOUT
} from "./config";


import AsyncLock from "async-lock";
import moment from "moment";

export function imageTagProcessor(app: Plugin,
  noteFile: TFile,
  settings: ISettings,
  defaultdir: boolean,
  source: string = ""
) {


  //////////??????????????????????????????
  const unique = Math.random().toString(16).slice(2,);
  const lock = new AsyncLock();

  async function processImageTag(replPattern: any) {

    let { replp, anchor, link, protocol, caption, AttSize, keypart, q1, q2 } = replPattern;



    logError("processImageTag: " + replp)
    logError(replPattern);
    if (!isUrl(link)) {
      return replp;
    }

    try {

      let fpath =  link.replace(protocol, "");
      let fileData: ArrayBuffer;



      if (protocol == "data:") {
        logError("ReadBase64: \r\n" + link, false);
        fileData = await base64ToBuff(link);
      }
      else if (protocol == "file:") {
        logError("Readlocal: \r\n" + fpath, false);
        fileData = await readFromDisk(fpath);
        if (fileData === null) {
          fileData = await readFromDisk(decodeURI(fpath));
        }
      }
      else {
        //Try to download several times, rotating the referer: origin first, then frontmatter 'source'
        const origin = link.match(URL_PATTERN) ? link.match(URL_PATTERN)[0] : "";
        const referers: Array<string> = [];
        for (const candidate of [origin, source]) {
          const value = String(candidate ?? "").trim();
          if (value.length != 0 && !referers.includes(value)) {
            referers.push(value);
          }
        }
        let trycount = 0;
        while (trycount < settings.tryCount) {
          const referer = (referers.length != 0) ? referers[trycount % referers.length] : "";
          fileData = await downloadImage(link, referer);
          logError("\r\n\nDownloading (try): " + trycount + " referer: " + referer + "\r\n\n");
          if (fileData !== null) { break; }
          trycount++;
        }
      }
      if (fileData === null) {
        logError("Cannot copy/download an attachment! Try to add referer in frontmatter 'source' field.", false);
        showBalloon("Cannot copy/download an attachment! Try to add referer in frontmatter 'source' field.", settings.showNotifications, NOTICE_TIMEOUT);
        return null;
      }


      if (Math.round(fileData.byteLength / 1024) < settings.filesizeLimit) {
        logError("Lower limit of the file size!", false);
        return null;
      }

      try {

        const mediaDir = await getMDir(app.app, noteFile, settings, defaultdir, unique);

        const { fileName, needWrite } = await lock.acquire(link, async function () {


          const parsedUrl = new URL(link);

          let fileExt = await getFileExt(fileData, parsedUrl.pathname);


          if (fileExt == "png" && settings.PngToJpeg) {
            fileData = await blobToJpegArrayBuffer(fileData, settings.JpegQuality * 0.01, settings.ImgCompressionType)
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

          if (needWrite && fileName) {
            await app.ensureFolderExists(mediaDir);
            await app.app.vault.createBinary(fileName, fileData);
          }

          return { fileName, needWrite };
        });



        if (fileName) {

          let shortName = "";

          let { pathWiki, pathMd, parsedPathE } = await getRDir(noteFile, settings, fileName, link);



          if (settings.addNameOfFile && protocol == "file:") {

            if (!app.app.vault.getConfig("useMarkdownLinks")) {

              shortName = "\r\n[[" +
                fileName +
                "\|" +
                parsedPathE["lnkurid"] + "]]\r\n";
            }
            else {
              shortName = "\r\n[" +
                parsedPathE["lnkurid"] +
                "](" +
                parsedPathE["pathuri"] +
                ")\r\n";
            }
          }

          let imageTag = "";

          if (!app.app.vault.getConfig("useMarkdownLinks")) {

            // image size has higher priority, otherwise the caption is kept
            if (!settings.useCaptions) {
              caption = "";
            } else if (AttSize.length) {
              caption = "\|" + AttSize;
            } else {
              caption = caption.length ? "\|" + caption : "";
            }

            imageTag = `![[${pathWiki}${caption}]]`;
          }

          else {
            (!settings.useCaptions || !caption.length) ? caption = "" : caption = " " + caption;
            imageTag = `![${anchor}](${pathMd}${caption})`;
          }

          //the tag without the frontmatter key: what the metadata cache reports as the embed
          const bareImageTag = imageTag;

          //frontmatter values must stay a valid yaml scalar: restore the key and the quotes
          if (keypart !== undefined && keypart !== "") {
            const quote = (q1 || q2) || `"`;
            imageTag = keypart + quote + imageTag + quote;
          }

          return [replp, imageTag, `${shortName}`, bareImageTag];



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





export async function getRDir(noteFile: TFile,
  settings: ISettings,
  fileName: string,
  link: string = undefined):
  Promise<any> {
  let pathWiki = "";
  let pathMd = "";

  const notePath = normalizePath(noteFile.parent.path);
  const parsedPath = path.parse(normalizePath(fileName));

  const parsedPathE = {
    parentd: path.basename(parsedPath["dir"]),
    basen: (parsedPath["name"] + parsedPath["ext"]),
    lnkurid: path.basename(decodeURI(link)),
    pathuri: encodeURI(normalizePath(fileName))
  };



  switch (settings.pathInTags) {
    case "baseFileName":
      pathWiki = pathMd = parsedPathE["basen"];
      break;
    case "onlyRelative":
      pathWiki = pathJoin([path.relative(path.sep + notePath, path.sep + parsedPath["dir"]), parsedPathE["basen"]]);
      pathMd = encodeURI(pathWiki);
      break;
    case "fullDirPath":
      pathWiki = normalizePath(fileName);
      pathMd = parsedPathE["pathuri"];
      break;
    default:
      pathWiki = fileName;
      pathMd = parsedPathE["pathuri"];
  };
  return { pathWiki: pathWiki, pathMd: pathMd, parsedPathE: parsedPathE };

}


export async function getMDir(
  app: App,
  noteFile: TFile,
  settings: ISettings,
  defaultdir: boolean = false,
  unique: string = ""): Promise<string> {


  const notePath = noteFile.parent.path;
  const date = new Date();
  const current_date = moment().format(settings.DateFormat);
  const obsmediadir = app.vault.getConfig("attachmentFolderPath");
  const mediadir = settings.mediaRootDir;
  var attdir = settings.saveAttE;
  if (defaultdir) { attdir = "" };
  let root = "/";

  switch (attdir) {

    case 'inFolderBelow':
      root = mediadir
        .replace("${notename}", noteFile.basename)
        .replace("${unique}", unique)
        .replace("${date}", current_date);
      break;

    case 'nextToNoteS':
      root = (pathJoin([noteFile.parent.path, mediadir]))
        .replace("${notename}", noteFile.basename)
        .replace("${unique}", unique)
        .replace("${date}", current_date);
      break;

    default:

      root =
        (obsmediadir === '/') ? obsmediadir :
          (obsmediadir === './') ? pathJoin([noteFile.parent.path]) :
            (obsmediadir.match(/\.\/.+/g) !== null) ? pathJoin([noteFile.parent.path, obsmediadir.replace('\.\/', '')]) :
              root = normalizePath(obsmediadir);
  }

  return trimAny(root, ["/", "\\"]);
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
  logError("file: " + link + " content: " + contentData + " file ext: " + fileExt, false);



  if (fileExt == "unknown" && !settings.downUnknown) {
    return { fileName: "", needWrite: false };
  }


  if (ignoredExt.includes(fileExt)) {
    return { fileName: "", needWrite: false };
  }




  const baseName = md5Sig(contentData);

  let needWrite = true;
  let fileName = "";
  const suggestedName = pathJoin([dir, cFileName(`${baseName}` + `.${fileExt}`)]);
  if (await adapter.exists(suggestedName, false)) {
    const fileData = await adapter.readBinary(suggestedName);
    const existing_file_md5 = md5Sig(fileData);
    if (existing_file_md5 === baseName) {
      fileName = suggestedName;
      needWrite = false;
    }
    else {
      fileName = pathJoin([dir, cFileName(Math.random().toString(9).slice(2,) + `.${fileExt}`)]);
    }

  } else {
    fileName = suggestedName;
  }

  logError("File name: " + fileName, false);
  if (!fileName) {
    throw new Error("Failed to generate file name for media file.");
  }

  //linkHashes.ensureHashGenerated(link, contentData);

  return { fileName, needWrite };
}

export function NoteContentReplacer(NoteData: string, Patterns: Object) {

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


//frontmatter block only: from the leading "---" line up to and including the closing "---" line
const FRONTMATTER_SPLIT_PATTERN = /^---[ \t]*\r?\n(?:[\s\S]*?\r?\n)?---[ \t]*(?:\r?\n|$)/;

export function splitFrontmatter(content: string): [string, string] {
  const match = content.match(FRONTMATTER_SPLIT_PATTERN);
  if (!match) { return ["", content]; }
  return [content.slice(0, match[0].length), content.slice(match[0].length)];
}

export function getFrontmatterSource(fmPart: string): string {
  if (!fmPart) { return ""; }
  const match = fmPart.match(/^[ \t]*source[ \t]*:[ \t]*(.*)$/im);
  if (!match) { return ""; }
  return match[1].trim().replace(/^['"](.*)['"]$/, "$1").trim();
}



export async function FrontMatterParser(app: Plugin, noteFile: TFile, SearchPattern: Array<RegExp>) {

  const FrontMatterEmbeds = { files: new Array, urls: new Array };

  await app.app.fileManager.processFrontMatter(noteFile, (frontmatter: Object): Object => {

    if (!frontmatter) {
      return FrontMatterEmbeds;
    }

    Object.entries(frontmatter).forEach(([key, value]) => {

      for (const reg_p of SearchPattern) {
        //a /g regex keeps lastIndex after .test() and would miss the next value
        reg_p.lastIndex = 0;
        if (reg_p.test(String(value))) {

          const LocLinkfound = String(value).match(reg_p)?.groups?.loclink;
          const UrlLinkfound = String(value).match(reg_p)?.groups?.urllink;

          if (LocLinkfound != undefined) {
            const FileBaseName = CtagsBrcks(LocLinkfound);
            const MDMatch = CtagsWhS(String(value).match(reg_p)[0]);
            FrontMatterEmbeds.files.push({ "key": key, "match": MDMatch, "link": FileBaseName });
          }
          if (UrlLinkfound != undefined) {
            const FileBaseName = CtagsBrcks(UrlLinkfound);
            const MDMatch = CtagsWhS(String(value).match(reg_p)[0]);
            FrontMatterEmbeds.urls.push({ "key": key, "match": MDMatch, "link": FileBaseName });
          }
        }
      }

    });

  });

  return FrontMatterEmbeds;
} 