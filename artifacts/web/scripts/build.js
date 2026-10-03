#!/usr/bin/env node
const { spawnSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const webDir = path.resolve(__dirname, "..");
const mobileDir = path.resolve(webDir, "..", "mobile");
const outDir = path.join(webDir, "dist", "public");

if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

console.log("[web/build] Exporting Expo web from mobile source...");
const result = spawnSync(
  "pnpm",
  ["exec", "expo", "export", "--platform", "web", "--output-dir", outDir],
  {
    cwd: mobileDir,
    stdio: "inherit",
    env: { ...process.env },
  }
);

if (result.status !== 0) {
  console.error("[web/build] Expo export failed");
  process.exit(result.status || 1);
}

console.log("[web/build] Done. Output:", outDir);
