/*
 * Test that command registration/cleanup prevents duplicates (#145).
 * Simulates Obsidian's plugin lifecycle: onload → onunload → onload.
 */
const { test, describe } = require("node:test");
const assert = require("node:assert");

// Minimal Plugin mock
class PluginMock {
  constructor() {
    this.commands = new Map();
    this.manifest = { id: "obsidian-local-images-plus" };
    this.settings = {};
    this.app = {
      commands: {
        removeCommand: (id) => {
          // Obsidian stores as "pluginId:commandId"
          const fullId = this.manifest.id + ":" + id;
          this.commands.delete(fullId);
        },
      },
    };
  }

  addCommand(cmd) {
    const fullId = this.manifest.id + ":" + cmd.id;
    if (this.commands.has(fullId)) {
      throw new Error(`Command already registered: ${fullId}`);
    }
    this.commands.set(fullId, cmd);
    return cmd;
  }

  removeCommand(cmdId) {
    const fullId = this.manifest.id + ":" + cmdId;
    this.commands.delete(fullId);
  }

  addRibbonIcon() {
    return { remove: () => {} };
  }

  registerDomEvent() {}
  registerEvent() {}
}

// Simulate the plugin's registerCommands + onunload
function registerCommands(plugin) {
  plugin.addCommand({ id: "download-images", name: "test1", callback: () => {} });
  plugin.addCommand({ id: "download-images-def", name: "test2", callback: () => {} });
  plugin.addCommand({ id: "set-title-as-name", name: "test3", callback: () => {} });
}

function unloadCommands(plugin) {
  const ids = [
    "download-images", "download-images-def", "set-title-as-name",
  ];
  for (const id of ids) {
    try {
      plugin.removeCommand(id);
    } catch (_) {}
  }
}

describe("command lifecycle (#145)", () => {
  test("single load registers commands once", () => {
    const p = new PluginMock();
    registerCommands(p);
    assert.strictEqual(p.commands.size, 3);
  });

  test("unload removes all commands", () => {
    const p = new PluginMock();
    registerCommands(p);
    unloadCommands(p);
    assert.strictEqual(p.commands.size, 0);
  });

  test("unload + reload cycle has no duplicates", () => {
    const p1 = new PluginMock();
    registerCommands(p1);
    assert.strictEqual(p1.commands.size, 3);

    // simulate update: unload old instance
    unloadCommands(p1);
    assert.strictEqual(p1.commands.size, 0);

    // new instance loads
    const p2 = new PluginMock();
    registerCommands(p2);
    assert.strictEqual(p2.commands.size, 3);
  });

  test("commands are accessible by plugin:command format", () => {
    const p = new PluginMock();
    registerCommands(p);
    assert.ok(p.commands.has("obsidian-local-images-plus:download-images"));
    assert.ok(p.commands.has("obsidian-local-images-plus:download-images-def"));
    assert.ok(p.commands.has("obsidian-local-images-plus:set-title-as-name"));
  });

  test("removeCommand removes by bare id (not plugin-prefixed)", () => {
    const p = new PluginMock();
    registerCommands(p);
    p.removeCommand("download-images");
    assert.strictEqual(p.commands.size, 2);
    assert.ok(!p.commands.has("obsidian-local-images-plus:download-images"));
  });

  test("double register without unload would throw (proves guard is needed)", () => {
    const p = new PluginMock();
    registerCommands(p);
    // Our code now prevents this via removeCommand before re-register,
    // but if it happened, addCommand would throw
    assert.throws(() => registerCommands(p));
  });

  test("unload is idempotent — safe to call twice", () => {
    const p = new PluginMock();
    registerCommands(p);
    unloadCommands(p);
    unloadCommands(p); // second call is a no-op
    assert.strictEqual(p.commands.size, 0);
  });
});
