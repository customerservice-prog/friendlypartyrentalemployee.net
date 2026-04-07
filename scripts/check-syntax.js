/**
 * Run `node --check` on every .js file under backend/, scripts/,
 * and frontend/js/ (excluding node_modules). Browser-only files
 * must still be valid ECMAScript.
 */
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const skipDirs = new Set(["node_modules"]);

function collectJs(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      if (skipDirs.has(ent.name)) continue;
      out.push(...collectJs(path.join(dir, ent.name)));
    } else if (ent.isFile() && ent.name.endsWith(".js")) {
      out.push(path.join(dir, ent.name));
    }
  }
  return out;
}

const backendRoot = path.join(__dirname, "..", "backend");
const scriptsRoot = __dirname;
const frontendJsRoot = path.join(__dirname, "..", "frontend", "js");
const files = [
  ...collectJs(backendRoot),
  ...collectJs(scriptsRoot),
  ...collectJs(frontendJsRoot),
];

for (const f of files) {
  execFileSync(process.execPath, ["--check", f], { stdio: "inherit" });
}
console.log(
  "Syntax OK:",
  files.length,
  "file(s) (backend/ + scripts/ + frontend/js/)"
);
