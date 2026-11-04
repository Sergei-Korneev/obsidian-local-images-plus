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
