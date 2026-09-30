// tools/serve.mjs — Zero-dependency static file server for local previewing.
// The project has no build step and no packages, so this uses only Node built-ins.
// Usage: node tools/serve.mjs [port]   (default port 4173)

import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.argv[2] ?? process.env.PORT ?? 4173);
// The project root is the parent of this tools/ directory.
const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".woff2": "font/woff2"
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8", ...headers });
  res.end(body);
}

async function resolveFile(urlPath) {
  // Strip query/hash and decode, then keep the path inside ROOT.
  const clean = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  const target = resolve(join(ROOT, normalize(clean)));
  if (target !== ROOT && !target.startsWith(ROOT + (process.platform === "win32" ? "\\" : "/"))) {
    return null; // path traversal attempt
  }

  const info = await stat(target).catch(() => null);
  if (info?.isDirectory()) {
    const indexFile = join(target, "index.html");
    const indexInfo = await stat(indexFile).catch(() => null);
    return indexInfo?.isFile() ? indexFile : null;
  }
  return info?.isFile() ? target : null;
}

const server = createServer(async (req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return send(res, 405, "Method Not Allowed", { Allow: "GET, HEAD" });
  }

  try {
    const file = await resolveFile(req.url || "/");
    if (!file) return send(res, 404, "404 Not Found");

    const type = TYPES[extname(file).toLowerCase()] ?? "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": type,
      "Cache-Control": "no-store" // always show the latest edits in the preview
    });
    if (req.method === "HEAD") return res.end();
    createReadStream(file)
      .on("error", () => send(res, 500, "500 Internal Server Error"))
      .pipe(res);
  } catch (err) {
    send(res, 500, `500 Internal Server Error\n${err?.message ?? err}`);
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[serve] ${ROOT} → http://127.0.0.1:${PORT}/`);
});

server.on("error", (err) => {
  console.error(`[serve] failed on port ${PORT}: ${err.message}`);
  process.exit(1);
});
