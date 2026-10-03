#!/usr/bin/env node
const http = require("http");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const ROOT = path.resolve(__dirname, "..", "dist", "public");
const basePath = (process.env.BASE_PATH || "/").replace(/\/+$/, "");
const port = parseInt(process.env.PORT || "3000", 10);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".map": "application/json",
};

const COMPRESSIBLE = new Set([
  ".html",
  ".js",
  ".mjs",
  ".json",
  ".css",
  ".svg",
  ".map",
  ".ttf",
  ".otf",
]);

// In-memory caches: raw bytes + pre-gzipped bytes per file.
// The build is immutable per server boot, so we can pre-compress aggressively.
const rawCache = new Map();
const gzipCache = new Map();

function readFileCached(filePath) {
  let buf = rawCache.get(filePath);
  if (!buf) {
    buf = fs.readFileSync(filePath);
    rawCache.set(filePath, buf);
  }
  return buf;
}

function gzipCached(filePath, buf) {
  let gz = gzipCache.get(filePath);
  if (!gz) {
    gz = zlib.gzipSync(buf, { level: 9 });
    gzipCache.set(filePath, gz);
  }
  return gz;
}

function safeJoin(root, urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const normalized = path.posix.normalize(decoded);
  const candidate = path.join(root, normalized);
  if (!candidate.startsWith(root)) return null;
  return candidate;
}

function send(res, status, headers, body) {
  res.writeHead(status, headers);
  res.end(body);
}

function isHashedAsset(filePath) {
  // Expo emits files with a content hash in the name, e.g.
  // entry-c8f526649587b44e2f6155b8e3aaba6c.js or Inter_400Regular.abc123.ttf
  // Cache those forever; everything else (index.html, favicon) gets short cache.
  const base = path.basename(filePath);
  return /\.[a-f0-9]{16,}\./i.test(base) || base.startsWith("entry-");
}

function serveFile(filePath, req, res) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || "application/octet-stream";
  const buf = readFileCached(filePath);

  const headers = { "content-type": type };
  if (isHashedAsset(filePath)) {
    headers["cache-control"] = "public, max-age=31536000, immutable";
  } else if (ext === ".html") {
    headers["cache-control"] = "no-cache";
  } else {
    headers["cache-control"] = "public, max-age=300";
  }

  const acceptEnc = (req.headers["accept-encoding"] || "").toString();
  const canGzip = COMPRESSIBLE.has(ext) && /\bgzip\b/.test(acceptEnc);

  if (canGzip) {
    const gz = gzipCached(filePath, buf);
    headers["content-encoding"] = "gzip";
    headers["vary"] = "Accept-Encoding";
    headers["content-length"] = gz.length;
    return send(res, 200, headers, gz);
  }

  headers["content-length"] = buf.length;
  send(res, 200, headers, buf);
}

const server = http.createServer((req, res) => {
  let url = req.url || "/";
  if (basePath && url.startsWith(basePath)) {
    url = url.slice(basePath.length) || "/";
  }
  const candidate = safeJoin(ROOT, url);
  if (!candidate) return send(res, 403, {}, "Forbidden");

  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return serveFile(candidate, req, res);
  }
  // SPA fallback
  const fallback = path.join(ROOT, "index.html");
  if (fs.existsSync(fallback)) {
    return serveFile(fallback, req, res);
  }
  send(res, 404, {}, "Not found");
});

server.listen(port, "0.0.0.0", () => {
  console.log(`[web/serve] http://0.0.0.0:${port}${basePath || "/"} (gzip+cache)`);
});
