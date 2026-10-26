const test = require("node:test");
const assert = require("node:assert/strict");
const C = require("../js/core.js");
const cfg = { name: "demo", about: "A thing.", stack: ["React", "TypeScript"], principles: ["tests", "minimal"], indent: "2 spaces", cmdTest: "npm test", dont: "- touch dist/\nuse var" };
test("body sections", () => {
  const b = C.body(cfg);
  assert.match(b, /^# demo — AI coding rules/);
  assert.match(b, /## Stack\nReact, TypeScript\n\n- Function components/);
  assert.match(b, /## How to work\n- Make the smallest change.*\n- Add or update tests/);
  assert.match(b, /## Commands\n- Tests: `npm test`/);
  assert.match(b, /## Never\n- touch dist\/\n- use var/);
  assert.doesNotMatch(b, /## Structure/);
});
test("cursor mdc frontmatter", () => {
  const r = C.render({ ...cfg, globs: "src/**/*.ts" }, "cursor");
  assert.match(r, /^---\ndescription: demo coding rules\nglobs: src\/\*\*\/\*\.ts\nalwaysApply: true\n---\n\n# demo/);
  assert.ok(!C.render(cfg, "agents").startsWith("---"));
});
test("formats have file names", () => { for (const f of Object.values(C.FORMATS)) assert.ok(f.file && f.label); });
