import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { parse } from "node:url";
import type { IncomingMessage, ServerResponse } from "node:http";

const ROOT = process.cwd();
const PORT = Number(process.env.PORT || 3000);

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

async function readAsset(path: string): Promise<Buffer | null> {
  try {
    return await readFile(path);
  } catch {
    return null;
  }
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  try {
    const url = parse(req.url ?? "/");
    const pathname = decodeURIComponent(url.pathname ?? "/");

    let filePath = normalize(join(ROOT, pathname === "/" ? "index.html" : pathname));
    if (!filePath.startsWith(ROOT)) {
      res.statusCode = 403;
      res.end("Forbidden");
      return;
    }

    const file = await readAsset(filePath);

    if (file === null) {
      const index = await readAsset(join(ROOT, "index.html"));
      if (index === null) {
        res.statusCode = 404;
        res.end("Not Found");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(index);
      return;
    }

    const contentType =
      MIME_TYPES[extname(filePath).toLowerCase()] ?? "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(file);
  } catch {
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}

if (require.main === module) {
  createServer(handler).listen(PORT, () => {
    console.log(`Portfólio rodando em http://localhost:${PORT}`);
  });
}