/*
 * Tests for binaryUtils — pure binary helpers (mobile compatibility).
 * Compiles src/binaryUtils.ts to CommonJS and tests the real code.
 */
const { execSync } = require("child_process");
const path = require("path");
const { test, describe } = require("node:test");
const assert = require("node:assert");

// compile the pure module (only dep: crypto-js) for testing
execSync(
  "npx tsc src/binaryUtils.ts --outDir tests/.build --module commonjs --target es2020 --skipLibCheck --esModuleInterop",
  { cwd: path.join(__dirname, ".."), stdio: "pipe" }
);
const {
  extractSamples,
  compareArrayBuffers,
  base64ToBuff,
  md5Sig,
} = require("./.build/binaryUtils.js");

//helper: build an ArrayBuffer from a byte array
function buf(...bytes) {
  return new Uint8Array(bytes).buffer;
}

describe("extractSamples", () => {
  test("extracts head / middle / tail from a small buffer", () => {
    const data = new Uint8Array(30).buffer;
    const samples = extractSamples(data, 10);
    assert.strictEqual(samples.length, 3);
    assert.strictEqual(samples[0].byteLength, 10);
    assert.strictEqual(samples[1].byteLength, 10);
    assert.strictEqual(samples[2].byteLength, 10);
  });

  test("returns full buffer for small input (chunk > size)", () => {
    const data = new Uint8Array(5).buffer;
    const samples = extractSamples(data, 15000);
    assert.strictEqual(samples.length, 3);
    // all slices are capped at buffer size
    assert.strictEqual(samples[0].byteLength, 5);
  });

  test("samples contain correct byte positions", () => {
    const arr = new Uint8Array(100);
    for (let i = 0; i < 100; i++) arr[i] = i;
    const samples = extractSamples(arr.buffer, 10);
    // head: bytes 0-9
    assert.strictEqual(new Uint8Array(samples[0])[0], 0);
    assert.strictEqual(new Uint8Array(samples[0])[9], 9);
    // tail: bytes 90-99
    assert.strictEqual(new Uint8Array(samples[2])[0], 90);
    assert.strictEqual(new Uint8Array(samples[2])[9], 99);
  });
});

describe("compareArrayBuffers", () => {
  test("equal buffers return true", () => {
    assert.strictEqual(compareArrayBuffers(buf(1, 2, 3), buf(1, 2, 3)), true);
  });

  test("different bytes return false", () => {
    assert.strictEqual(compareArrayBuffers(buf(1, 2, 3), buf(1, 2, 4)), false);
  });

  test("different sizes return false", () => {
    assert.strictEqual(compareArrayBuffers(buf(1, 2, 3), buf(1, 2)), false);
  });

  test("empty buffers are equal", () => {
    assert.strictEqual(compareArrayBuffers(buf(), buf()), true);
  });

  test("large buffers with single difference at end", () => {
    const a = new Uint8Array(10000).fill(0xff);
    const b = new Uint8Array(10000).fill(0xff);
    b[9999] = 0x00;
    assert.strictEqual(compareArrayBuffers(a.buffer, b.buffer), false);
  });

  test("large identical buffers return true", () => {
    const a = new Uint8Array(100000).fill(0xab);
    const b = new Uint8Array(100000).fill(0xab);
    assert.strictEqual(compareArrayBuffers(a.buffer, b.buffer), true);
  });
});

describe("base64ToBuff", () => {
  test("decodes data-url format", () => {
    // "AQID" = bytes 0x01, 0x02, 0x03
    const result = base64ToBuff("data:image/png;base64,AQID");
    assert.strictEqual(result.byteLength, 3);
    const bytes = new Uint8Array(result);
    assert.strictEqual(bytes[0], 0x01);
    assert.strictEqual(bytes[1], 0x02);
    assert.strictEqual(bytes[2], 0x03);
  });

  test("decodes bare base64 string", () => {
    const result = base64ToBuff("AQID");
    assert.strictEqual(result.byteLength, 3);
  });

  test("decodes empty string", () => {
    const result = base64ToBuff("data:;base64,");
    assert.strictEqual(result.byteLength, 0);
  });

  test("invalid base64 returns null", () => {
    const result = base64ToBuff("data:;base64,!!!invalid!!!");
    assert.strictEqual(result, null);
  });

  test("roundtrip with large data", () => {
    const original = new Uint8Array(10000).fill(0x7f);
    let binary = "";
    for (let i = 0; i < original.length; i++) {
      binary += String.fromCharCode(original[i]);
    }
    const b64 = btoa(binary);
    const result = base64ToBuff("data:;base64," + b64);
    assert.strictEqual(result.byteLength, 10000);
    assert.deepStrictEqual(new Uint8Array(result), original);
  });
});

describe("md5Sig", () => {
  test("returns consistent hash for same samples", () => {
    const samples = [buf(1, 2, 3), buf(4, 5, 6), buf(7, 8, 9)];
    const hash1 = md5Sig(samples);
    const hash2 = md5Sig(samples);
    assert.strictEqual(hash1, hash2);
    assert.ok(hash1.length > 0);
  });

  test("different samples produce different hashes", () => {
    const hash1 = md5Sig([buf(1, 2, 3)]);
    const hash2 = md5Sig([buf(4, 5, 6)]);
    assert.notStrictEqual(hash1, hash2);
  });

  test("returns null on invalid input", () => {
    assert.strictEqual(md5Sig(null), null);
    assert.strictEqual(md5Sig(undefined), null);
  });
});
