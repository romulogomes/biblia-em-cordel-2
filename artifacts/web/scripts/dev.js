#!/usr/bin/env node
const { spawnSync, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const webDir = path.resolve(__dirname, "..");
const outDir = path.join(webDir, "dist", "public");

console.log("[web/dev] Building Expo web bundle (one-time)...");
const build = spawnSync("node", [path.join(__dirname, "build.js")], {
  cwd: webDir,
  stdio: "inherit",
  env: { ...process.env },
});

if (build.status !== 0 || !fs.existsSync(path.join(outDir, "index.html"))) {
  console.error("[web/dev] Build failed; cannot start server");
  process.exit(build.status || 1);
}

console.log("[web/dev] Starting static server...");
const serve = spawn("node", [path.join(__dirname, "serve.js")], {
  cwd: webDir,
  stdio: "inherit",
  env: { ...process.env },
});

const cleanup = () => {
  if (serve && !serve.killed) serve.kill("SIGTERM");
  process.exit(0);
};
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.on("SIGHUP", cleanup);
serve.on("exit", (code) => process.exit(code || 0));
