const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const Module = require("node:module");
const { after } = require("node:test");

// Obsidian supplies this module at runtime; npm ships only its type definitions.
// Keep filesystem operations real and replace only the unavailable host APIs.
class Plugin {
  constructor(app) {
    this.app = app;
  }
}
const obsidian = {
  Plugin,
  PluginSettingTab: class {},
  Modal: class {},
  TFile: class {},
  Notice: class {},
  getLanguage: () => "en",
};
const sourceRoot = path.resolve(
  process.env.LOCAL_IMAGES_SOURCE_ROOT || path.join(__dirname, "..")
);
require("ts-node").register({
  project: path.join(sourceRoot, "tsconfig.json"),
  transpileOnly: true,
  compilerOptions: { module: "CommonJS" },
});
const originalLoad = Module._load;
Module._load = function (id, parent, isMain) {
  if (id === "obsidian") return obsidian;
  if (id.startsWith("src/")) id = path.join(sourceRoot, id);
  return originalLoad.call(this, id, parent, isMain);
};
let utils, config, LocalImagesPlugin, imageTagProcessor;
try {
  utils = require(path.join(sourceRoot, "src/utils.ts"));
  config = require(path.join(sourceRoot, "src/config.ts"));
  LocalImagesPlugin = process.env.LOCAL_IMAGES_BUNDLE
    ? require(path.resolve(process.env.LOCAL_IMAGES_BUNDLE))
    : require(path.join(sourceRoot, "src/main.ts")).default;
  ({ imageTagProcessor } = require(path.join(
    sourceRoot,
    "src/contentProcessor.ts"
  )));
} finally {
  Module._load = originalLoad;
}
global.window = { clearInterval };

function arrayBuffer(bytes) {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  );
}

// JPEG signature plus synthetic payload; no personal image is checked in.
// Byte 20,000 lies outside md5Sig's first/middle/last sampling windows.
function collisionPair(size = 100000) {
  const first = Buffer.alloc(size, 65);
  first.set([0xff, 0xd8, 0xff]);
  const second = Buffer.from(first);
  second[20000] = 66;
  return [first, second];
}

async function fixture(registerCleanup = after) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "local-images-test-"));
  registerCleanup(() => fs.rm(root, { recursive: true, force: true }));
  const reads = [];
  const stats = [];
  const removed = [];
  const adapter = {
    basePath: root,
    async exists(name) {
      try {
        await fs.stat(path.join(root, name));
        return true;
      } catch (error) {
        if (error.code === "ENOENT") return false;
        throw error;
      }
    },
    async stat(name) {
      stats.push(name);
      try {
        return await fs.stat(path.join(root, name));
      } catch (error) {
        if (error.code === "ENOENT") return null;
        throw error;
      }
    },
    async readBinary(name) {
      reads.push(name);
      return arrayBuffer(await fs.readFile(path.join(root, name)));
    },
    async writeBinary(name, data) {
      await fs.writeFile(path.join(root, name), Buffer.from(data));
    },
    async rename(from, to) {
      await fs.rename(path.join(root, from), path.join(root, to));
    },
    async remove(name) {
      removed.push(name);
      await fs.unlink(path.join(root, name));
    },
  };
  const put = async (name, bytes) => {
    await fs.mkdir(path.dirname(path.join(root, name)), { recursive: true });
    await fs.writeFile(path.join(root, name), bytes);
  };
  const get = (name) => fs.readFile(path.join(root, name));
  const note = {
    path: "notes/example.md",
    basename: "example",
    parent: { path: "notes" },
  };
  const embeds = [{ link: "incoming.jpg", original: "![[incoming.jpg]]" }];
  await put(note.path, embeds[0].original);
  const app = {
    metadataCache: { getFileCache: () => ({ embeds }) },
    vault: {
      adapter,
      getConfig: (key) =>
        ({ attachmentFolderPath: "./attachments", useMarkdownLinks: false }[
          key
        ]),
      cachedRead: async () => (await get(note.path)).toString(),
      modify: async (file, text) => put(file.path, text),
      createBinary: async (name, data) =>
        fs.writeFile(path.join(root, name), Buffer.from(data), { flag: "wx" }),
    },
  };
  const plugin = new LocalImagesPlugin(app);
  plugin.settings = {
    ...config.DEFAULT_SETTINGS,
    PngToJpegLocal: false,
    showNotifications: false,
  };
  plugin.ensureFolderExists = (name) =>
    fs.mkdir(path.join(root, name), { recursive: true });
  plugin.Notify = () => {};
  return {
    root,
    adapter,
    put,
    get,
    reads,
    stats,
    removed,
    note,
    embeds,
    plugin,
  };
}

module.exports = {
  utils,
  arrayBuffer,
  collisionPair,
  fixture,
  imageTagProcessor,
};
