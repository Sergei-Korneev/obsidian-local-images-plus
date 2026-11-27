/*
 * Tests for buildImageTag — the frontmatter plain-path feature (#137).
 * Compiles src/buildImageTag.ts to CommonJS and tests the real code.
 */
const { execSync } = require("child_process");
const path = require("path");
const { test, describe } = require("node:test");
const assert = require("node:assert");

// compile the pure module (no Obsidian deps) for testing
execSync(
  "npx tsc src/buildImageTag.ts --outDir tests/.build --module commonjs --target es2020 --skipLibCheck",
  { cwd: path.join(__dirname, ".."), stdio: "pipe" }
);
const { buildImageTag } = require("./.build/buildImageTag.js");

//shared defaults for tests
const base = {
  pathWiki: "_resources/note/img.jpg",
  pathMd: "_resources/note/img.jpg",
  pathMdAngle: "_resources/note/img.jpg",
  anchor: "",
  caption: "",
  attSize: "",
  useMd: false,
  useCaptions: true,
  useMarkdownLinkFormat: false,
};

describe("frontmatter + plainFmPaths (#137)", () => {
  test("bare url in frontmatter → plain path with yaml key and quotes", () => {
    const { imageTag, bareImageTag } = buildImageTag({
      ...base,
      keypart: "propertyname: ",
      plainFmPaths: true,
    });
    assert.strictEqual(imageTag, 'propertyname: "_resources/note/img.jpg"');
    assert.strictEqual(bareImageTag, "_resources/note/img.jpg");
  });

  test("embed in frontmatter → plain path without brackets", () => {
    const { imageTag } = buildImageTag({
      ...base,
      keypart: "cover: ",
      q1: "",
      q2: "",
      plainFmPaths: true,
    });
    assert.strictEqual(imageTag, 'cover: "_resources/note/img.jpg"');
  });

  test("original quotes are preserved", () => {
    const { imageTag } = buildImageTag({
      ...base,
      keypart: "hero: ",
      q1: "'",
      q2: "'",
      plainFmPaths: true,
    });
    assert.strictEqual(imageTag, "hero: '_resources/note/img.jpg'");
  });

  test("caption and size are dropped for plain paths", () => {
    const { imageTag } = buildImageTag({
      ...base,
      caption: "My Cover",
      attSize: "300",
      keypart: "cover: ",
      plainFmPaths: true,
    });
    assert.strictEqual(imageTag, 'cover: "_resources/note/img.jpg"');
    assert.ok(!imageTag.includes("My Cover"));
    assert.ok(!imageTag.includes("300"));
  });
});

describe("frontmatter + plainFmPaths off (default)", () => {
  test("wiki embed is kept", () => {
    const { imageTag, bareImageTag } = buildImageTag({
      ...base,
      keypart: "cover: ",
      plainFmPaths: false,
    });
    assert.strictEqual(imageTag, 'cover: "![[ _resources/note/img.jpg]]"'.replace("![[ _", "![[_"));
    assert.strictEqual(bareImageTag, "![[ _resources/note/img.jpg]]".replace("![[ _", "![[_"));
  });

  test("size anchor is kept in embed", () => {
    const { imageTag } = buildImageTag({
      ...base,
      attSize: "300",
      keypart: "cover: ",
      plainFmPaths: false,
    });
    assert.ok(imageTag.includes("|300"));
    assert.ok(imageTag.includes("![[_resources/note/img.jpg|300]]"));
  });

  test("caption is kept in embed", () => {
    const { imageTag } = buildImageTag({
      ...base,
      caption: "My Cover",
      keypart: "cover: ",
      plainFmPaths: false,
    });
    assert.ok(imageTag.includes("|My Cover"));
  });
});

describe("body links are not affected by plainFmPaths", () => {
  test("wiki embed in body stays ![[...]] even with plainFmPaths on", () => {
    const { imageTag, bareImageTag } = buildImageTag({
      ...base,
      plainFmPaths: true,
    });
    assert.strictEqual(imageTag, "![[ _resources/note/img.jpg]]".replace("![[ _", "![[_"));
    assert.strictEqual(bareImageTag, "![[ _resources/note/img.jpg]]".replace("![[ _", "![[_"));
  });

  test("markdown link in body stays ![...](...) with plainFmPaths on", () => {
    const { imageTag } = buildImageTag({
      ...base,
      useMd: true,
      anchor: "alt text",
      plainFmPaths: true,
    });
    assert.strictEqual(imageTag, "![alt text](_resources/note/img.jpg)");
  });

  test("markdown link with markdownLinkFormat uses angle brackets", () => {
    const { imageTag } = buildImageTag({
      ...base,
      useMd: true,
      useMarkdownLinkFormat: true,
      plainFmPaths: true,
    });
    assert.strictEqual(imageTag, "![](<_resources/note/img.jpg>)");
  });
});

describe("markdown link format in frontmatter", () => {
  test("frontmatter + plainFmPaths wins over markdown format", () => {
    const { imageTag } = buildImageTag({
      ...base,
      useMd: true,
      useMarkdownLinkFormat: true,
      keypart: "cover: ",
      plainFmPaths: true,
    });
    assert.strictEqual(imageTag, 'cover: "_resources/note/img.jpg"');
  });

  test("frontmatter + plainFmPaths off + markdown format → md link with yaml key", () => {
    const { imageTag } = buildImageTag({
      ...base,
      useMd: true,
      keypart: "cover: ",
      plainFmPaths: false,
    });
    assert.strictEqual(imageTag, 'cover: "![](_resources/note/img.jpg)"');
  });
});

describe("saveSourceUrl in frontmatter (#140)", () => {
  test("source URL is NOT appended to frontmatter values", () => {
    const { imageTag } = buildImageTag({
      ...base,
      keypart: "cover: ",
      sourceUrl: "https://example.com/orig.jpg",
      saveSourceUrl: "link",
      plainFmPaths: false,
    });
    // must be valid YAML: no newline, no [Source] inside
    assert.ok(!imageTag.includes("[Source]"));
    assert.ok(!imageTag.includes("\n"));
    assert.ok(imageTag.startsWith("cover: "));
    assert.ok(imageTag.endsWith('"'));
  });

  test("source URL IS appended in body (no keypart)", () => {
    const { imageTag } = buildImageTag({
      ...base,
      sourceUrl: "https://example.com/orig.jpg",
      saveSourceUrl: "link",
    });
    assert.ok(imageTag.includes("\n[Source](https://example.com/orig.jpg)"));
  });

  test("frontmatter + plainFmPaths + saveSourceUrl stays valid YAML", () => {
    const { imageTag } = buildImageTag({
      ...base,
      keypart: "cover: ",
      sourceUrl: "https://example.com/orig.jpg",
      saveSourceUrl: "text",
      plainFmPaths: true,
    });
    assert.ok(!imageTag.includes("\n"));
    assert.ok(!imageTag.includes("https://example.com"));
    assert.strictEqual(imageTag, 'cover: "_resources/note/img.jpg"');
  });
});

describe("frontmatter YAML list items (#142)", () => {
  test("bare url as list item preserves dash prefix and adds quotes-free tag", () => {
    const { imageTag } = buildImageTag({
      ...base,
      keypart: "  - ",
      q1: "",
      q2: "",
      sourceUrl: "https://host/a.jpg",
      saveSourceUrl: "none",
      plainFmPaths: true,
    });
    assert.strictEqual(imageTag, "  - _resources/note/img.jpg");
  });

  test("list item with wiki embed keeps dash prefix", () => {
    const { imageTag } = buildImageTag({
      ...base,
      keypart: "  - ",
      q1: "",
      q2: "",
      saveSourceUrl: "none",
      plainFmPaths: false,
    });
    assert.strictEqual(imageTag, "  - ![[ _resources/note/img.jpg]]".replace("![[ _", "![[_"));
  });

  test("list item with source URL does NOT append newline (frontmatter)", () => {
    const { imageTag } = buildImageTag({
      ...base,
      keypart: "  - ",
      q1: "",
      q2: "",
      sourceUrl: "https://host/a.jpg",
      saveSourceUrl: "link",
      plainFmPaths: true,
    });
    assert.ok(!imageTag.includes("[Source]"));
    assert.ok(!imageTag.includes("\n"));
    assert.ok(imageTag.startsWith("  - "));
  });

  test("tab-indented list item preserves tab prefix", () => {
    const { imageTag } = buildImageTag({
      ...base,
      keypart: "\t- ",
      q1: "",
      q2: "",
      saveSourceUrl: "none",
      plainFmPaths: true,
    });
    assert.ok(imageTag.startsWith("\t- "));
  });

  test("list item with markdown format preserves dash prefix", () => {
    const { imageTag } = buildImageTag({
      ...base,
      keypart: "  - ",
      q1: "",
      q2: "",
      useMd: true,
      useMarkdownLinkFormat: true,
      saveSourceUrl: "none",
    });
    assert.ok(imageTag.startsWith("  - "));
    assert.ok(imageTag.includes("]"));
  });
});

describe("frontmatter single value edge cases", () => {
  test("value in double quotes gets quotes restored", () => {
    const { imageTag } = buildImageTag({
      ...base,
      keypart: "image: ",
      q1: '"',
      q2: '"',
      saveSourceUrl: "none",
      plainFmPaths: true,
    });
    assert.strictEqual(imageTag, 'image: "_resources/note/img.jpg"');
  });

  test("value in single quotes gets single quotes restored", () => {
    const { imageTag } = buildImageTag({
      ...base,
      keypart: "image: ",
      q1: "'",
      q2: "'",
      saveSourceUrl: "none",
      plainFmPaths: true,
    });
    assert.strictEqual(imageTag, "image: '_resources/note/img.jpg'");
  });

  test("no quotes gets default double quotes", () => {
    const { imageTag } = buildImageTag({
      ...base,
      keypart: "image: ",
      saveSourceUrl: "none",
      plainFmPaths: true,
    });
    assert.strictEqual(imageTag, 'image: "_resources/note/img.jpg"');
  });

  test("frontmatter + saveSourceUrl=link produces no extra content", () => {
    const { imageTag } = buildImageTag({
      ...base,
      keypart: "image: ",
      q1: '"',
      q2: '"',
      sourceUrl: "https://host/orig.jpg",
      saveSourceUrl: "link",
    });
    assert.ok(!imageTag.includes("[Source]"));
    assert.ok(!imageTag.includes("\n"));
  });

  test("frontmatter + saveSourceUrl=text produces no extra content", () => {
    const { imageTag } = buildImageTag({
      ...base,
      keypart: "image: ",
      q1: '"',
      q2: '"',
      sourceUrl: "https://host/orig.jpg",
      saveSourceUrl: "text",
    });
    assert.ok(!imageTag.includes("https://host"));
    assert.ok(!imageTag.includes("\n"));
  });

  test("frontmatter + saveSourceUrl=caption uses URL as caption", () => {
    const { imageTag } = buildImageTag({
      ...base,
      keypart: "image: ",
      q1: '"',
      q2: '"',
      sourceUrl: "https://host/orig.jpg",
      saveSourceUrl: "caption",
      plainFmPaths: false,
    });
    // caption is replaced with sourceUrl inside the embed
    assert.ok(imageTag.includes("image:"));
  });
});

describe("frontmatter linked images", () => {
  test("linked image in frontmatter uses innerLink for download, outerLink as source", () => {
    // Simulates: [![alt](thumb)](full_url) in frontmatter
    const { imageTag } = buildImageTag({
      ...base,
      keypart: "cover: ",
      q1: '"',
      q2: '"',
      sourceUrl: "https://host/page.html",
      saveSourceUrl: "none",
      plainFmPaths: true,
    });
    assert.strictEqual(imageTag, 'cover: "_resources/note/img.jpg"');
    assert.ok(!imageTag.includes("page.html"));
  });

  test("linked image in frontmatter with saveSourceUrl does not leak URL", () => {
    const { imageTag } = buildImageTag({
      ...base,
      keypart: "cover: ",
      q1: '"',
      q2: '"',
      sourceUrl: "https://host/page.html",
      saveSourceUrl: "link",
      plainFmPaths: true,
    });
    assert.ok(!imageTag.includes("page.html"));
    assert.ok(!imageTag.includes("[Source]"));
    assert.ok(!imageTag.includes("\n"));
  });
});
