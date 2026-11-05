/*
 * Pure binary utilities — no Obsidian/Node imports except crypto-js.
 * Extracted for testability. Re-exported from utils.ts.
 */
import md5 from "crypto-js/md5";

const SAMPLE_CHUNK = 15000;

//extract head / middle / tail samples from an in-memory buffer
export function extractSamples(
  data: ArrayBuffer,
  chunk: number = SAMPLE_CHUNK
): ArrayBuffer[] {
  const mid = Math.round(data.byteLength / 2);
  return [
    data.slice(0, chunk),
    data.slice(mid, mid + chunk),
    data.slice(Math.max(0, data.byteLength - chunk)),
  ];
}

//pure comparison of two ArrayBuffers (works on any platform)
export function compareArrayBuffers(a: ArrayBuffer, b: ArrayBuffer): boolean {
  if (a.byteLength !== b.byteLength) return false;
  const ua = new Uint8Array(a);
  const ub = new Uint8Array(b);
  for (let i = 0; i < ua.length; i++) {
    if (ua[i] !== ub[i]) return false;
  }
  return true;
}

//decode a data-url or bare base64 string to ArrayBuffer (no Node Buffer)
export function base64ToBuff(data: string): ArrayBuffer {
  try {
    const base64 = data.includes("base64,")
      ? data.split("base64,")[1]
      : data;
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  } catch (e) {
    return null;
  }
}

//hash an array of byte samples into an md5 signature string
export function md5Sig(samples: ArrayBuffer[]): string {
  try {
    const dec = new TextDecoder("utf-8");
    const signature = md5(
      samples.map((x) => dec.decode(x)).join()
    ).toString();
    return signature;
  } catch (e) {
    return null;
  }
}
