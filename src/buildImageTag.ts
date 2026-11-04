/*
 * Pure tag-building logic for image replacement.
 * Extracted from utils.ts so it can be tested without Obsidian API mocks.
 * No imports — zero runtime dependencies.
 */

export interface ImageTagOpts {
  pathWiki: string;
  pathMd: string;
  pathMdAngle: string;
  anchor: string;
  caption: string;
  attSize: string;
  keypart?: string;
  q1?: string;
  q2?: string;
  useMd: boolean;
  useCaptions: boolean;
  plainFmPaths: boolean;
  useMarkdownLinkFormat: boolean;
}

export function buildImageTag(
  o: ImageTagOpts
): { imageTag: string; bareImageTag: string } {
  let caption = o.caption;
  let imageTag = "";
  const isFmValue = o.keypart !== undefined && o.keypart !== "";

  if (isFmValue && o.plainFmPaths) {
    //plain path for Bases: no embed brackets, no caption/size
    imageTag = o.pathWiki;
  } else if (!o.useMd) {
    // image size has higher priority, otherwise the caption is kept
    if (!o.useCaptions) {
      caption = "";
    } else if (o.attSize.length) {
      caption = "|" + o.attSize;
    } else {
      caption = caption.length ? "|" + caption : "";
    }
    imageTag = `![[${o.pathWiki}${caption}]]`;
  } else {
    caption = !o.useCaptions || !caption.length ? "" : " " + caption;
    const mdLink = o.useMarkdownLinkFormat ? `<${o.pathMdAngle}>` : o.pathMd;
    imageTag = `![${o.anchor}](${mdLink}${caption})`;
  }

  const bareImageTag = imageTag;

  //frontmatter values must stay a valid yaml scalar: restore the key and the quotes
  if (isFmValue) {
    const quote = o.q1 || o.q2 || `"`;
    imageTag = o.keypart + quote + imageTag + quote;
  }

  return { imageTag, bareImageTag };
}
