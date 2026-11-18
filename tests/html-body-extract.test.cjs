/*
 * Test extractHtmlBody with real Habr article HTML.
 * Verifies body extraction, script/style removal, and that
 * image URLs survive for downstream markdown conversion.
 */
const { test, describe } = require("node:test");
const assert = require("node:assert");

//extract body content from full HTML pages
function extractHtmlBody(html) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (bodyMatch) {
    let body = bodyMatch[1];
    body = body.replace(/<script[\s\S]*?<\/script>/gi, "");
    body = body.replace(/<style[\s\S]*?<\/style>/gi, "");
    body = body.replace(/<noscript[\s\S]*?<\/noscript>/gi, "");
    body = body.replace(/<nav[\s\S]*?<\/nav>/gi, "");
    body = body.replace(/<header[\s\S]*?<\/header>/gi, "");
    body = body.replace(/<footer[\s\S]*?<\/footer>/gi, "");
    return body;
  }
  return html;
}

//simple mock of Obsidian's htmlToMarkdown
function htmlToMarkdown(html) {
  return html
    .replace(/<figure[^>]*>/gi, "\n")
    .replace(/<\/figure>/gi, "\n")
    .replace(/<img[^>]+src="([^"]+)"[^>]*>/gi, "![]($1)")
    .replace(/<img[^>]+src='([^']+)'[^>]*>/gi, "![]($1)")
    .replace(/<a[^>]+href="([^"]+)"[^>]*>([^<]*)<\/a>/gi, "[$2]($1)")
    .replace(/<h1[^>]*>([^<]*)<\/h1>/gi, "# $1\n")
    .replace(/<h2[^>]*>([^<]*)<\/h2>/gi, "## $1\n")
    .replace(/<strong>([^<]*)<\/strong>/gi, "**$1**")
    .replace(/<em>([^<]*)<\/em>/gi, "*$1*")
    .replace(/<code>([^<]*)<\/code>/gi, "`$1`")
    .replace(/<li>/gi, "- ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<p[^>]*>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

describe("extractHtmlBody with Habr article HTML (#57)", () => {
  test("extracts body, removes head/meta/script", () => {
    const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<title>Test</title>
<meta name="description" content="test">
<script>window.__STATE__={"foo":"bar"};</script>
<style>.grecaptcha-badge{visibility:hidden}</style>
<link href="https://example.com/style.css" rel="stylesheet">
</head>
<body>
<div id="app"><article><p>Real content here</p></article></div>
<script>var x = 1;</script>
</body>
</html>`;

    const body = extractHtmlBody(html);
    assert.ok(body.includes("Real content here"));
    assert.ok(!body.includes("grecaptcha"));
    assert.ok(!body.includes("__STATE__"));
    assert.ok(!body.includes("window.__STATE__"));
    assert.ok(!body.includes("var x = 1"));
    assert.ok(!body.includes("<title>"));
    assert.ok(!body.includes("meta name"));
    assert.ok(!body.includes("stylesheet"));
  });

  test("fragment without body tag passes through unchanged", () => {
    const fragment = '<p>Hello <img src="pic.jpg"> world</p>';
    assert.strictEqual(extractHtmlBody(fragment), fragment);
  });

  test("image src survives extraction and conversion", () => {
    const html = `<body><figure><img src="https://example.com/photo.jpg" alt="Photo" width="1280"></figure></body>`;
    const body = extractHtmlBody(html);
    const md = htmlToMarkdown(body);
    assert.ok(md.includes("![](https://example.com/photo.jpg)"));
    assert.ok(!md.includes("<img"));
  });

  test("full Habr-like page: body extracted, images found", () => {
    const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<title>IPFS вместо HTTP</title>
<meta property="og:image" content="https://habrastorage.org/getpro/habr/upload_files/be5/d8c/80b/be5d8c80b9dde1418b3d6fda5b02d010.jpg">
<script type="application/ld+json">{"@context":"http://schema.org"}</script>
<meta name="viewport" content="width=device-width">
<link rel="stylesheet" href="https://assets.habr.com/css/style.css">
<script>window.__PINIA_STATE__={"articles":{}}</script>
</head>
<body>
<div id="mount"><article class="tm-article">
<p>Сегодня мы заходим на сайты.</p>
<figure class="full-width">
<img src="https://habrastorage.org/r/w1560/getpro/habr/upload_files/be5/d8c/80b/be5d8c80b9dde1418b3d6fda5b02d010.jpg" alt="Источник" width="1280" height="720">
<div><figcaption>Источник: <a href="https://hdhai.com/">hdhai.com</a></figcaption></div>
</figure>
<p><strong>Что такое IPFS</strong></p>
<p>Кратко напомним.</p>
</article></div>
<script async src="https://www.googletagmanager.com/gtag/js"></script>
</body>
</html>`;

    const body = extractHtmlBody(html);
    const md = htmlToMarkdown(body);

    // body content preserved
    assert.ok(md.includes("Сегодня мы заходим на сайты"));
    assert.ok(md.includes("Что такое IPFS"));
    assert.ok(md.includes("Кратко напомним"));

    // image URL preserved
    assert.ok(md.includes("![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/be5/d8c/80b/be5d8c80b9dde1418b3d6fda5b02d010.jpg)"));

    // link preserved
    assert.ok(md.includes("[hdhai.com](https://hdhai.com/)"));

    // head garbage removed
    assert.ok(!md.includes("__PINIA_STATE__"));
    assert.ok(!md.includes("googletagmanager"));
    assert.ok(!md.includes("stylesheet"));
    assert.ok(!md.includes("application/ld+json"));
    assert.ok(!md.includes("og:image"));
  });

  test("noscript tracking pixels removed", () => {
    const html = `<body><noscript><img src="https://tracker.com/pixel.gif" style="position:absolute"></noscript><p>Content</p></body>`;
    const body = extractHtmlBody(html);
    assert.ok(body.includes("Content"));
    assert.ok(!body.includes("tracker.com"));
  });

  test("nav/header/footer removed from body", () => {
    const html = `<body><nav><a href="/menu">Menu</a></nav><header>Header text</header><p>Article</p><footer>Footer text</footer></body>`;
    const body = extractHtmlBody(html);
    assert.ok(body.includes("Article"));
    assert.ok(!body.includes("Menu"));
    assert.ok(!body.includes("Header text"));
    assert.ok(!body.includes("Footer text"));
  });

  test("multiple images in body all preserved", () => {
    const html = `<body>
<img src="https://example.com/a.jpg">
<p>text</p>
<img src="https://example.com/b.jpg">
<p>more</p>
<img src="https://example.com/c.jpg">
</body>`;
    const body = extractHtmlBody(html);
    const md = htmlToMarkdown(body);
    assert.ok(md.includes("![](https://example.com/a.jpg)"));
    assert.ok(md.includes("![](https://example.com/b.jpg)"));
    assert.ok(md.includes("![](https://example.com/c.jpg)"));
  });

  test("HTML without body but with content is not empty", () => {
    const html = '<div><img src="pic.jpg"><p>text</p></div>';
    const result = extractHtmlBody(html);
    assert.ok(result.includes("pic.jpg"));
  });
});
