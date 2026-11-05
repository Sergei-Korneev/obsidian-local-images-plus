import path, { resolve } from "path";
import { fromBuffer } from "file-type";
import isSvg from "is-svg";
import md5 from "crypto-js/md5";
const fs2 = require("fs").promises;
import fs from "fs";

import {
  USER_AGENT,
  NOTICE_TIMEOUT,
  APP_TITLE,
  VERBOSE,
  SUPPORTED_OS,
  ATT_SIZE_ACHOR,
  MD_LINK,
} from "./config";

import { requestUrl, Notice, TFile, DataAdapter, Platform } from "obsidian";

//import { TIMEOUT } from "dns";
//import fs from "fs";

/*
https://stackoverflow.com/a/48032528/1020973
It will be better to do it type-correct.
*/

export async function showBalloon(
  str: string,
  show: boolean = true,
  timeout = NOTICE_TIMEOUT
) {
  if (show) {
    new Notice(APP_TITLE + "\r\n" + str, timeout);
  }
}

export function displayError(error: Error | string, file?: TFile): void {
  if (file) {
    showBalloon(
      `LocalImagesPlus: Error while handling file ${
        file.name
      }, ${error.toString()}`
    );
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
    } else {
      console.log(str);
    }
  }
}

//pure binary utilities — see binaryUtils.ts
export { base64ToBuff, extractSamples, compareArrayBuffers, md5Sig } from "./binaryUtils";
import { base64ToBuff, extractSamples, compareArrayBuffers, md5Sig } from "./binaryUtils";

export function MarkdownLinkParser(match: RegExp | string): any {
  let link: string,
    anchor: string,
    replp: any,
    caption = "",
    AttSize = "";
  const keypart = match.groups?.keypart;
  const q1 = match.groups?.q1;
  const q2 = match.groups?.q2;
  const isWikiEmbed = match[0].includes("![[");

  logError("Match: " + match);

  anchor = CtagsBrcks(match.groups?.anchor ?? "");

  for (const attmatch of anchor.matchAll(ATT_SIZE_ACHOR)) {
    AttSize =
      attmatch.groups.attsize !== undefined
        ? CtagsBrcks(attmatch.groups.attsize)
        : attmatch.groups.attsize2 !== undefined
        ? CtagsBrcks(attmatch.groups.attsize2)
        : "";
  }

  //a wikilink embed carries no alt text: the anchor must stay empty in markdown output mode
  if (isWikiEmbed) {
    anchor = "";
  }

  link = CtagsBrcks(match.groups.link.match(MD_LINK)?.[0] ?? match.groups.link);
  const protocol = link.slice(0, 5);
  caption = CtagsBrcks(
    MD_LINK.test(match.groups.link)
      ? match.groups.link.split(link)[1] ?? ""
      : ""
  );
  //keep the exact match text for frontmatter keys and wiki brackets: replaceAll searches for it literally
  replp =
    keypart !== undefined || isWikiEmbed
      ? match[0]
      : trimAny(match[0], ["[", "(", "]"]);

  if (protocol == "file:") {
    SUPPORTED_OS.win.includes(process.platform)
      ? link.replace("file:///", "")
      : SUPPORTED_OS.unix.includes(process.platform)
      ? link.replace("file://", "")
      : link.replace("file://", "");
    const parsedPath = path.parse(link);
    link = parsedPath.dir + "/" + parsedPath.name + trimTags(parsedPath.ext);
  }

  logError(
    {
      replp: replp,
      anchor: anchor,
      link: link,
      protocol: protocol,
      caption: caption,
      AttSize: AttSize,
      keypart: keypart,
    },
    true
  );

  return {
    replp: replp,
    anchor: anchor,
    link: link,
    protocol: protocol,
    caption: caption,
    AttSize: AttSize,
    keypart: keypart,
    q1: q1,
    q2: q2,
  };
}

export async function replaceAsync(
  str: any,
  regex: Array<RegExp>,
  asyncFn: any
) {
  logError("replaceAsync: \r\nstr: " + str + "\r\nregex: ");
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
      if (seen.has(ReplaceObj.replp)) {
        continue;
      }
      seen.add(ReplaceObj.replp);
      const promise = asyncFn(ReplaceObj);
      logError(promise, true);
      promises.push(promise);
    }
  });

  const data = await Promise.all(promises);
  logError("Promises: ");
  logError(data, true);
  //  return str.replace((reg: RegExp, str: String) => {

  const replaced = new Set<string>();
  data.forEach((element) => {
    if (Array.isArray(element)) {
      if (replaced.has(element[0])) {
        return;
      }
      replaced.add(element[0]);
      logError("Replacing " + element[0] + " to " + element[1]);
      str = str.replaceAll(element[0], element[1]);
      //the bare tag is what the metadata cache reports as an embed (no frontmatter key)
      filesArr.push(
        element[2] !== undefined && element[2] !== "" ? element[2] : element[1]
      );
    } else if (element === null) {
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
  } catch (e) {
    logError("Cannot copy: " + e, false);
    return null;
  }
}

export async function readFromDiskB(
  file: string,
  count?: number,
  offset: number = 0
): Promise<ArrayBuffer> {
  try {
    const size = fs.statSync(file).size;
    const length = Math.min(count ?? size, Math.max(0, size - offset));
    if (length <= 0) return new ArrayBuffer(0);

    const buffer = Buffer.alloc(length);
    const fd = fs.openSync(file, "r");
    try {
      fs.readSync(fd, buffer, 0, length, offset);
    } finally {
      fs.closeSync(fd);
    }
    return bufferToArrayBuffer(buffer);
  } catch (e) {
    logError("Cannot read the file: " + e, false);
    return null;
  }
}

const SAMPLE_CHUNK = 15000;

//read head / middle / tail samples from a file without loading it fully
export async function readSamples(
  adapter: DataAdapter,
  filePath: string,
  chunk: number = SAMPLE_CHUNK
): Promise<ArrayBuffer[]> {
  if (Platform.isMobile) {
    // mobile: adapter reads the whole file, extractSamples slices it
    const data = await adapter.readBinary(filePath);
    return extractSamples(data, chunk);
  }
  // desktop: read 3 chunks directly from disk (45 KB I/O)
  const absPath = pathJoin([(adapter as any).basePath as string, filePath]);
  const size = fs.statSync(absPath).size;
  const mid = Math.round(size / 2);
  return Promise.all([
    readFromDiskB(absPath, chunk, 0),
    readFromDiskB(absPath, chunk, mid),
    readFromDiskB(absPath, chunk, Math.max(0, size - chunk)),
  ]);
}

export async function readFromDisk(file: string): Promise<ArrayBuffer> {
  logError("readFromDisk: " + file, false);

  try {
    const data = await fs2.readFile(file, null);
    return bufferToArrayBuffer(Buffer.from(data));
  } catch (e) {
    logError("Cannot read the file: " + e, false);
    return null;
  }
}

export async function downloadImage(
  url: string,
  referer: string = ""
): Promise<ArrayBuffer> {
  logError("Downloading: " + url + " referer: " + referer, false);
  const headers = {
    method: "GET",
    "User-Agent": USER_AGENT,
    Referer: referer,
  };

  try {
    const res = await requestUrl({ url: url, headers });
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
  } catch (e) {
    logError("Cannot download the file: " + e, false);
    return null;
  }
}

function bufferToArrayBuffer(data: Uint8Array): ArrayBuffer {
  return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
}

export async function getFileExt(content: ArrayBuffer, link: string) {
  const fileExtByLink = path.extname(link).replace(".", "");
  const fileExtByBuffer = (await fromBuffer(content))?.ext;

  // if XML, probably it is SVG
  if (fileExtByBuffer == "xml" || !fileExtByBuffer) {
    const buffer = Buffer.from(content);
    if (isSvg(buffer)) return "svg";
  }

  logError("fileExtByBuffer" + fileExtByBuffer);

  if (
    fileExtByBuffer != undefined &&
    fileExtByBuffer &&
    fileExtByBuffer.length <= 5 &&
    fileExtByBuffer?.length > 0
  ) {
    return fileExtByBuffer;
  }

  logError("fileExtByLink  " + fileExtByLink);

  if (
    fileExtByLink != undefined &&
    fileExtByLink.length <= 5 &&
    fileExtByLink?.length > 0
  ) {
    return fileExtByLink;
  }

  return "unknown";
}

//https://stackoverflow.com/questions/26156292/trim-specific-character-from-a-string

export function trimAny(str: string, chars: Array<string>) {
  var start = 0,
    end = str.length;

  while (start < end && chars.indexOf(str[start]) >= 0) ++start;

  while (end > start && chars.indexOf(str[end - 1]) >= 0) --end;

  return start > 0 || end < str.length ? str.substring(start, end) : str;
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

export interface FileNameCtx {
  md5?: string;
  originalname?: string;
  notename?: string;
  date?: string;
  unique?: string;
  [key: string]: string | undefined;
}

const NAME_TEMPLATE_PATTERN = /\$\{(\w+)(?::(\d+))?\}/g;

export const NAME_TEMPLATE_VARIABLES = [
  "md5",
  "originalname",
  "notename",
  "date",
  "unique",
];

//kind: "file" - result is a sanitized file name base (no extension), "path" - result is a folder path (kept as is)
export function renderNameTemplate(
  template: string,
  ctx: FileNameCtx,
  kind: "file" | "path" = "file"
): string {
  let rendered = (template || "").replace(
    NAME_TEMPLATE_PATTERN,
    (match: string, name: string, lenStr?: string) => {
      const value = ctx[name];
      if (value === undefined || value === null) {
        return match;
      }
      if (lenStr !== undefined) {
        const len = parseInt(lenStr, 10);
        return len > 0 ? value.slice(0, len) : value;
      }
      return value;
    }
  );

  if (kind !== "file") {
    return rendered;
  }

  rendered = cFileName(rendered.replace(/[/\\?]+/g, " "));
  rendered = rendered.replace(/\s+/g, " ").trim();
  if (rendered.length > 200) {
    rendered = rendered.slice(0, 200).replace(/[.\s]+$/, "");
  }
  rendered = rendered.replace(/^[.\s]+/, "").replace(/[.\s]+$/, "");

  if (!rendered) {
    rendered = ctx.md5 || "";
  }
  if (!rendered) {
    rendered = "image";
  }
  return rendered;
}

const COMPARE_CHUNK_SIZE = 1024 * 1024; // 1 MiB
const MAX_MOBILE_COMPARE_SIZE = 100 * 1024 * 1024; // 100 MiB

//picks a file name: base + ext, appending " (N)" on collision.
//if the candidate exists and holds the same content, it is reused: needWrite = false
//comparison is done in chunks to avoid loading large files into memory entirely.
export async function resolveUniqueName(
  adapter: DataAdapter,
  dir: string,
  baseName: string,
  fileExt: string,
  contentHash: string,
  source: { kind: "file"; path: string } | { kind: "data"; data: ArrayBuffer }
): Promise<{ fileName: string; needWrite: boolean }> {
  let ext = fileExt ? (fileExt.startsWith(".") ? fileExt : "." + fileExt) : "";
  if (ext && baseName.toLowerCase().endsWith(ext.toLowerCase())) {
    ext = "";
  }

  // determine source size (stat for file sources, byteLength for data sources)
  let sourceSize: number | undefined;
  if (source.kind === "data") {
    sourceSize = source.data.byteLength;
  }

  for (let counter = 0; counter < 10000; counter++) {
    const suffix = counter ? ` (${counter})` : "";
    const candidate = pathJoin([dir, baseName + suffix + ext]);
    if (!(await adapter.exists(candidate, false))) {
      return { fileName: candidate, needWrite: true };
    }
    try {
      // cheap check: compare file sizes first (no content read)
      const candidateStat = await adapter.stat(candidate);
      if (!candidateStat) {
        continue;
      }
      if (sourceSize === undefined && source.kind === "file") {
        const sourceStat = await adapter.stat(source.path);
        if (!sourceStat) {
          continue;
        }
        sourceSize = sourceStat.size;
      }
      if (candidateStat.size !== sourceSize) {
        continue;
      }

      // sizes match: compare bytes (mobile: full read, desktop: chunked)
      //mobile guard: skip byte comparison for very large files to avoid OOM
      if (Platform.isMobile && candidateStat.size > MAX_MOBILE_COMPARE_SIZE) {
        return { fileName: candidate, needWrite: false };
      }
      const equal =
        source.kind === "data"
          ? await compareDataToFile(adapter, candidate, source.data)
          : await compareFiles(adapter, source.path, candidate);

      if (equal) {
        return { fileName: candidate, needWrite: false };
      }
    } catch (e) {
      logError("Cannot compare with existing file: " + e, false);
    }
  }

  throw new Error(`Cannot generate a unique file name: ${baseName}${ext}`);
}

//compare a data buffer against a file on disk
async function compareDataToFile(
  adapter: DataAdapter,
  filePath: string,
  data: ArrayBuffer
): Promise<boolean> {
  if (Platform.isMobile) {
    //mobile: read file into memory, compare with Uint8Array
    if (data.byteLength > MAX_MOBILE_COMPARE_SIZE) return false;
    const fileBuf = await adapter.readBinary(filePath);
    return compareArrayBuffers(fileBuf, data);
  }
  //desktop: chunk by chunk (no full-file load)
  const absPath = pathJoin([(adapter as any).basePath as string, filePath]);
  const fh = await fs2.open(absPath, "r");
  try {
    const stat = await fh.stat();
    if (stat.size !== data.byteLength) {
      return false;
    }
    const fileBuf = Buffer.alloc(COMPARE_CHUNK_SIZE);
    const dataView = new Uint8Array(data);
    let position = 0;

    for (;;) {
      const { bytesRead } = await fh.read(
        fileBuf,
        0,
        COMPARE_CHUNK_SIZE,
        position
      );
      if (bytesRead === 0) return true; // EOF, all chunks matched
      if (
        !fileBuf
          .subarray(0, bytesRead)
          .equals(Buffer.from(dataView.buffer, dataView.byteOffset + position, bytesRead))
      )
        return false;
      position += bytesRead;
    }
  } finally {
    await fh.close().catch(() => {});
  }
}

//compare two files on disk
async function compareFiles(
  adapter: DataAdapter,
  pathA: string,
  pathB: string
): Promise<boolean> {
  if (Platform.isMobile) {
    //mobile: read both files into memory, compare with Uint8Array
    const statA = await adapter.stat(pathA);
    if (!statA || statA.size > MAX_MOBILE_COMPARE_SIZE) return false;
    const [bufA, bufB] = await Promise.all([
      adapter.readBinary(pathA),
      adapter.readBinary(pathB),
    ]);
    return compareArrayBuffers(bufA, bufB);
  }
  //desktop: chunk by chunk via Node fs (no full-file read)
  const basePath = (adapter as any).basePath as string;
  const absA = pathJoin([basePath, pathA]);
  const absB = pathJoin([basePath, pathB]);

  const fdA = fs2.open(absA, "r");
  const fdB = fs2.open(absB, "r");
  try {
    const [a, b] = await Promise.all([fdA, fdB]);
    const bufA = Buffer.alloc(COMPARE_CHUNK_SIZE);
    const bufB = Buffer.alloc(COMPARE_CHUNK_SIZE);
    let position = 0;

    for (;;) {
      const [nA, nB] = await Promise.all([
        a.read(bufA, 0, COMPARE_CHUNK_SIZE, position),
        b.read(bufB, 0, COMPARE_CHUNK_SIZE, position),
      ]);
      // different bytes read → files differ in size (should not happen after stat, but be safe)
      if (nA.bytesRead !== nB.bytesRead) return false;
      if (nA.bytesRead === 0) return true; // both EOF at same position
      if (!bufA.subarray(0, nA.bytesRead).equals(bufB.subarray(0, nB.bytesRead)))
        return false;
      position += nA.bytesRead;
    }
  } finally {
    await Promise.all([fdA, fdB])
      .then(([a, b]) => Promise.all([a.close(), b.close()]))
      .catch(() => {});
  }
}

//builds the replacement tag for a processed image.
//see buildImageTag.ts for the pure implementation (extracted for testability).
export { buildImageTag, ImageTagOpts } from "./buildImageTag";

export function trimTags(link: string) {
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
  return e.replace(/[\\\x00\x08\x0B\x0C\x0E-\x1F ]/g, function (e) {
    return encodeURIComponent(e);
  });
}

/**
 * Converts image bytes to a compressed image in the requested format (JPEG or WEBP).
 *
 * The image is decoded, drawn onto a white-background canvas (JPEG has no alpha),
 * and re-encoded at the requested quality. No base64 intermediate is created:
 * input goes through URL.createObjectURL, output through canvas.toBlob.
 *
 * @param data   - Image bytes (PNG, WEBP, JPEG, …).
 * @param quality - Compression quality, 0–1. Values above 1 are treated as a
 *                  percentage and divided by 100. Clamped to [0, 1].
 * @param mimeType - Target MIME type, "image/jpeg" (default) or "image/webp".
 * @returns The compressed image bytes, or null if decoding/encoding failed.
 */
export async function blobToJpegArrayBuffer(
  data: ArrayBuffer,
  quality: number,
  mimeType: string = "image/jpeg"
): Promise<ArrayBuffer | null> {
  if (!data || data.byteLength === 0) {
    logError("blobToJpegArrayBuffer: empty input data", false);
    return null;
  }

  const type = mimeType || "image/jpeg";
  const q = Math.max(0, Math.min(1, quality > 1 ? quality / 100 : quality));

  // Decode the source image via an object URL (no base64 roundtrip).
  const sourceUrl = URL.createObjectURL(new Blob([data]));

  try {
    const image = await loadImage(sourceUrl);

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Cannot get 2D canvas context");
    }

    // JPEG has no alpha channel: paint the background white first.
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);

    // Encode directly to a Blob (no data-URL / base64 step).
    const outBlob = await canvasToBlob(canvas, type, q);
    return await readBlobAsArrayBuffer(outBlob);
  } catch (e) {
    logError("Cannot compress image: " + e, false);
    return null;
  } finally {
    // Release the object URL regardless of success or failure.
    URL.revokeObjectURL(sourceUrl);
  }
}

/* --- Promise wrappers over browser callback APIs --- */

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Cannot load image"));
    img.src = src;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob !== null
          ? resolve(blob)
          : reject(new Error("canvas.toBlob returned null")),
      type,
      quality
    );
  });
}

function readBlobAsArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () =>
      reject(reader.error ?? new Error("FileReader failed"));
    reader.readAsArrayBuffer(blob);
  });
}
