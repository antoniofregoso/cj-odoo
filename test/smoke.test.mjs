// Smoke test: imports the *built* dist (what actually gets published) and
// exercises the JSON-RPC payload construction with a mocked fetch (no real
// network calls). Catches broken exports and payload-shape regressions -
// not full behavioral coverage.
import { test } from "node:test";
import assert from "node:assert/strict";

globalThis.window = { location: { href: "http://test.local/" } };

function mockFetch(result) {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, headers: options.headers, body: JSON.parse(options.body) });
    return { json: async () => ({ result }) };
  };
  return calls;
}

const { OdooClient } = await import("../dist/odooClient.js");

test("builds the RPC url from host/db/port", () => {
  const withPort = new OdooClient({ host: "http://odoo.test", port: 8069, db: "mydb", username: "u", password: "p" });
  assert.equal(withPort.url, "http://odoo.test:8069/jsonrpc/");

  const withoutPort = new OdooClient({ host: "http://odoo.test", db: "mydb", username: "u", password: "p" });
  assert.equal(withoutPort.url, "http://odoo.test/jsonrpc/");
});

test("login() sends a 'common'/'login' JSON-RPC call and stores the uid", async () => {
  const calls = mockFetch(42);
  const client = new OdooClient({ host: "http://odoo.test", db: "mydb", username: "demo", password: "secret" });

  const uid = await client.login();

  assert.equal(uid, 42);
  assert.equal(client.uid, 42);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].body.method, "call");
  assert.equal(calls[0].body.params.service, "common");
  assert.equal(calls[0].body.params.method, "login");
  assert.deepEqual(calls[0].body.params.args, ["mydb", "demo", "secret"]);
});

test("update() sends a 'write' JSON-RPC call without throwing (regression: previously referenced an undefined `id`)", async () => {
  const calls = mockFetch(true);
  const client = new OdooClient({ host: "http://odoo.test", db: "mydb", username: "demo", password: "secret" });
  client.uid = 7;

  const res = await client.update("res.partner", [1], { name: "New name" });

  assert.equal(res, true);
  assert.equal(calls[0].body.params.method, "execute");
  assert.deepEqual(calls[0].body.params.args, ["mydb", 7, "secret", "res.partner", "write", [[1], { name: "New name" }]]);
});

test("send() sets the Origin header from window.location when window is available", async () => {
  const calls = mockFetch(1);
  const client = new OdooClient({ host: "http://odoo.test", db: "mydb", username: "demo", password: "secret" });
  await client.login();
  assert.equal(calls[0].headers.Origin, "http://test.local/");
});

test("send() works without throwing when window is not defined (non-browser environment)", async () => {
  const calls = mockFetch(1);
  const savedWindow = globalThis.window;
  delete globalThis.window;
  try {
    const client = new OdooClient({ host: "http://odoo.test", db: "mydb", username: "demo", password: "secret" });
    const uid = await client.login();
    assert.equal(uid, 1);
    assert.equal(calls[0].headers.Origin, undefined);
  } finally {
    globalThis.window = savedWindow;
  }
});

test("create/search/searchRead/read/delete forward args to the matching Odoo method", async () => {
  const cases = [
    ["create", "create"],
    ["search", "search"],
    ["searchRead", "search_read"],
    ["read", "read"],
    ["delete", "unlink"],
  ];
  for (const [clientMethod, odooMethod] of cases) {
    const calls = mockFetch([]);
    const client = new OdooClient({ host: "http://odoo.test", db: "mydb", username: "demo", password: "secret" });
    await client[clientMethod]("res.partner", { name: "x" });
    assert.equal(calls[0].body.params.args[3], "res.partner");
    assert.equal(calls[0].body.params.args[4], odooMethod);
  }
});
