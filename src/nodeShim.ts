/*
 * Lazy Node.js module access — safe on mobile where fs/path don't exist.
 * On desktop: uses real Node.js modules.
 * On mobile: path is shimmed, fs is null (callers must check).
 *
 * Uses eval-based require to prevent rollup from hoisting the call
 * to the top of the bundle (which would crash on mobile at load time).
 */

// Hide require from rollup's static analysis — keeps it inside try/catch
function safeRequire(id: string): any {
  try {
    // eslint-disable-next-line no-eval
    return eval("require")(id);
  } catch (e) {
    return null;
  }
}

// --- fs ---
const _fs: any = safeRequire("fs");

// --- path: use Node's if available, otherwise a minimal shim ---
const _path: any = (() => {
  const nodePath = safeRequire("path");
  if (nodePath) return nodePath;

  // mobile: browser-compatible path shim
  const sep = "/";
  return {
    sep,
    join: (...parts: string[]) => {
      const joined = parts.filter(Boolean).join(sep);
      return joined.replace(/\/+/g, "/");
    },
    parse: (p: string) => {
      const idx = p.lastIndexOf(sep);
      const dir = idx >= 0 ? p.substring(0, idx) : "";
      const base = idx >= 0 ? p.substring(idx + 1) : p;
      const dotIdx = base.lastIndexOf(".");
      const ext = dotIdx > 0 ? base.substring(dotIdx) : "";
      const name = dotIdx > 0 ? base.substring(0, dotIdx) : base;
      return { dir, base, ext, name };
    },
    basename: (p: string, ext?: string) => {
      let base = p.substring(p.lastIndexOf(sep) + 1);
      if (ext && base.endsWith(ext)) base = base.slice(0, -ext.length);
      return base;
    },
    extname: (p: string) => {
      const base = p.substring(p.lastIndexOf(sep) + 1);
      const dotIdx = base.lastIndexOf(".");
      return dotIdx > 0 ? base.substring(dotIdx) : "";
    },
    dirname: (p: string) => {
      const idx = p.lastIndexOf(sep);
      return idx >= 0 ? p.substring(0, idx) : "";
    },
    relative: (from: string, to: string) => {
      const fromParts = from.split(sep).filter(Boolean);
      const toParts = to.split(sep).filter(Boolean);
      let i = 0;
      while (i < fromParts.length && i < toParts.length && fromParts[i] === toParts[i]) {
        i++;
      }
      const up = fromParts.length - i;
      const result = [...Array(up).fill(".."), ...toParts.slice(i)];
      return result.join(sep);
    },
  };
})();

export const nodeFs = _fs;
export const nodePath = _path;
export const isNodeAvailable = _fs !== null;
