const assert = require("node:assert/strict");
const test = require("node:test");
const { pathToFileURL } = require("node:url");
const path = require("node:path");
const {
  utils,
  arrayBuffer,
  collisionPair,
  fixture,
  imageTagProcessor,
} = require("./helpers.cjs");

test("a free name does not stat or read the source", async () => {
  const { adapter, reads, stats } = await fixture();
  const result = await utils.resolveUniqueName(
    adapter,
    "images",
    "photo",
    ".jpg",
    { kind: "file", path: "source.jpg" }
  );
  assert.deepEqual(result, { fileName: "images/photo.jpg", needWrite: true });
  assert.deepEqual(reads, []);
  assert.deepEqual(stats, []);
});

test("identical bytes reuse the existing file", async () => {
  const { adapter, put } = await fixture();
  const [bytes] = collisionPair();
  await put("images/photo.jpg", bytes);
  const result = await utils.resolveUniqueName(
    adapter,
    "images",
    "photo",
    ".jpg",
    { kind: "data", data: arrayBuffer(bytes) }
  );
  assert.deepEqual(result, { fileName: "images/photo.jpg", needWrite: false });
});

test("same-size sampled-hash collisions get a new name", async () => {
  const { adapter, put, get } = await fixture();
  const [existing, incoming] = collisionPair();
  assert.equal(
    utils.md5Sig(arrayBuffer(existing)),
    utils.md5Sig(arrayBuffer(incoming))
  );
  await put("images/photo.jpg", existing);
  const result = await utils.resolveUniqueName(
    adapter,
    "images",
    "photo",
    ".jpg",
    { kind: "data", data: arrayBuffer(incoming) }
  );
  assert.deepEqual(result, {
    fileName: "images/photo (1).jpg",
    needWrite: true,
  });
  assert.deepEqual(await get("images/photo.jpg"), existing);
});

test("different sizes skip both file reads", async () => {
  const { adapter, put, reads } = await fixture();
  await put("images/photo.jpg", Buffer.from("old"));
  await put("source.jpg", Buffer.from("new image"));
  const result = await utils.resolveUniqueName(
    adapter,
    "images",
    "photo",
    ".jpg",
    { kind: "file", path: "source.jpg" }
  );
  assert.deepEqual(result, {
    fileName: "images/photo (1).jpg",
    needWrite: true,
  });
  assert.deepEqual(reads, []);
});

test("already loaded data uses its byte length to skip unequal-size candidates", async () => {
  const { adapter, put, reads, stats } = await fixture();
  await put("images/photo.jpg", Buffer.from("old"));
  const result = await utils.resolveUniqueName(
    adapter,
    "images",
    "photo",
    ".jpg",
    { kind: "data", data: arrayBuffer(Buffer.from("new image")) }
  );
  assert.deepEqual(result, {
    fileName: "images/photo (1).jpg",
    needWrite: true,
  });
  assert.deepEqual(reads, []);
  assert.deepEqual(stats, ["images/photo.jpg"]);
});

test("the source is loaded once while checking successive candidates", async () => {
  const { adapter, put, reads, stats } = await fixture();
  const [existing, incoming] = collisionPair();
  await put("images/photo.jpg", existing);
  await put("images/photo (1).jpg", existing);
  await put("images/photo (2).jpg", incoming);
  await put("source.jpg", incoming);
  const result = await utils.resolveUniqueName(
    adapter,
    "images",
    "photo",
    ".jpg",
    { kind: "file", path: "source.jpg" }
  );
  assert.equal(reads.filter((name) => name === "source.jpg").length, 1);
  assert.equal(stats.filter((name) => name === "source.jpg").length, 1);
  assert.deepEqual(result, {
    fileName: "images/photo (2).jpg",
    needWrite: false,
  });
});

for (const failingOperation of ["stat", "readBinary"]) {
  for (const failingFile of ["source.jpg", "images/photo.jpg"]) {
    test(`a ${failingOperation} failure for ${failingFile} never authorizes deduplication`, async () => {
      const { adapter, put } = await fixture();
      const [bytes] = collisionPair();
      await put("images/photo.jpg", bytes);
      await put("source.jpg", bytes);
      const originalOperation = adapter[failingOperation];
      adapter[failingOperation] = async (name) => {
        if (name === failingFile) throw new Error("simulated read failure");
        return originalOperation(name);
      };
      const result = await utils.resolveUniqueName(
        adapter,
        "images",
        "photo",
        ".jpg",
        { kind: "file", path: "source.jpg" }
      );
      assert.deepEqual(result, {
        fileName: "images/photo (1).jpg",
        needWrite: true,
      });
    });
  }
}

test("a missing source never authorizes deduplication", async () => {
  const { adapter, put, reads } = await fixture();
  await put("images/photo.jpg", Buffer.from("existing"));
  const result = await utils.resolveUniqueName(
    adapter,
    "images",
    "photo",
    ".jpg",
    { kind: "file", path: "missing.jpg" }
  );
  assert.deepEqual(result, {
    fileName: "images/photo (1).jpg",
    needWrite: true,
  });
  assert.deepEqual(reads, []);
});

test("a source growing after stat is not mistaken for an equal-prefix file", async () => {
  const { adapter, put } = await fixture();
  await put("images/photo.jpg", Buffer.from("same"));
  await put("source.jpg", Buffer.from("same"));
  const originalRead = adapter.readBinary;
  adapter.readBinary = async (name) => {
    if (name === "source.jpg") await put(name, Buffer.from("same but longer"));
    return originalRead(name);
  };
  const result = await utils.resolveUniqueName(
    adapter,
    "images",
    "photo",
    ".jpg",
    { kind: "file", path: "source.jpg" }
  );
  assert.deepEqual(result, {
    fileName: "images/photo (1).jpg",
    needWrite: true,
  });
});

async function importLocal(f, incoming, existing) {
  const name = `${utils.md5Sig(arrayBuffer(incoming.subarray(0, 5000)))}_MD5`;
  const destination = `notes/attachments/${name}.jpg`;
  await f.put(destination, existing);
  await f.put("notes/attachments/incoming.jpg", incoming);
  f.plugin.newfCreated = ["notes/attachments/incoming.jpg"];
  f.plugin.noteModified = [f.note];
  await f.plugin.processMdFilesOnTimer();
  return { destination, suffixed: `notes/attachments/${name} (1).jpg` };
}

test("local import preserves two different files with the same first 5000 bytes", async () => {
  const f = await fixture();
  const [existing, incoming] = collisionPair();
  const { destination, suffixed } = await importLocal(f, incoming, existing);
  assert.deepEqual(await f.get(destination), existing);
  assert.deepEqual(await f.get(suffixed), incoming);
  assert.equal((await f.get(f.note.path)).toString(), `![[${suffixed}]]`);
  assert.deepEqual(f.removed, []);
});

test("local import handles the different-size version of the original failure", async () => {
  const f = await fixture();
  const [existing, second] = collisionPair();
  const incoming = Buffer.concat([second, Buffer.from("extra bytes")]);
  const { destination, suffixed } = await importLocal(f, incoming, existing);
  assert.deepEqual(await f.get(destination), existing);
  assert.deepEqual(await f.get(suffixed), incoming);
  assert.equal((await f.get(f.note.path)).toString(), `![[${suffixed}]]`);
  assert.deepEqual(f.removed, []);
  assert.deepEqual(f.reads, []);
});

test("local import deletes only an exact duplicate and links to the surviving file", async () => {
  const f = await fixture();
  const [bytes] = collisionPair();
  const { destination } = await importLocal(f, bytes, bytes);
  assert.deepEqual(await f.get(destination), bytes);
  assert.equal((await f.get(f.note.path)).toString(), `![[${destination}]]`);
  assert.deepEqual(f.removed, ["notes/attachments/incoming.jpg"]);
  assert.equal(await f.adapter.exists("notes/attachments/incoming.jpg"), false);
});

test("local import compares equal-size large files beyond the sampled header", async () => {
  const f = await fixture();
  const [existing] = collisionPair(16 * 1024 * 1024);
  const incoming = Buffer.from(existing);
  incoming[incoming.length - 1] = 66;
  const { destination, suffixed } = await importLocal(f, incoming, existing);
  assert.deepEqual(await f.get(destination), existing);
  assert.deepEqual(await f.get(suffixed), incoming);
  assert.equal((await f.get(f.note.path)).toString(), `![[${suffixed}]]`);
  assert.deepEqual(f.removed, []);
  assert.deepEqual(f.reads, ["notes/attachments/incoming.jpg", destination]);
});

for (const identical of [false, true]) {
  test(`the download/copy path ${
    identical ? "reuses exact duplicates" : "preserves sampled-hash collisions"
  }`, async () => {
    const f = await fixture();
    const [existing, other] = collisionPair();
    const incoming = identical ? existing : other;
    const name = `${utils.md5Sig(arrayBuffer(incoming))}_MD5`;
    const destination = `notes/attachments/${name}.jpg`;
    const expected = identical
      ? destination
      : `notes/attachments/${name} (1).jpg`;
    await f.put(destination, existing);
    await f.put("source.jpg", incoming);
    const link = pathToFileURL(path.join(f.root, "source.jpg")).href;
    const processor = imageTagProcessor(
      f.plugin,
      f.note,
      f.plugin.settings,
      false
    );
    const result = await processor({
      replp: `![](${link})`,
      anchor: "",
      link,
      protocol: "file:",
      caption: "",
      AttSize: "",
    });
    assert.deepEqual(result, [
      `![](${link})`,
      `![[${expected}]]`,
      `![[${expected}]]`,
    ]);
    assert.deepEqual(await f.get(destination), existing);
    assert.deepEqual(await f.get(expected), incoming);
    assert.deepEqual(await f.get("source.jpg"), incoming);
  });
}
