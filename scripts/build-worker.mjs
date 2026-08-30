import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const server = path.join(dist, "server");

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
};

async function collectFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if ([".openai", "server"].includes(entry.name)) continue;

    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(entryPath)));
    } else {
      files.push(entryPath);
    }
  }

  return files.sort();
}

function toPublicPath(file) {
  return `/${path.relative(dist, file).split(path.sep).join("/")}`;
}

function getCacheControl(publicPath) {
  const fileName = path.posix.basename(publicPath);
  const isHashedAsset = publicPath.startsWith("/assets/")
    && /-[A-Za-z0-9_-]{8,}\./.test(fileName);

  if (isHashedAsset) return "public, max-age=31536000, immutable";
  if (publicPath.startsWith("/data/")) return "public, max-age=300, must-revalidate";
  if (["/index.html", "/robots.txt", "/site.webmanifest"].includes(publicPath)) {
    return "public, max-age=0, must-revalidate";
  }

  return "public, max-age=3600";
}

const assets = {};
for (const file of await collectFiles(dist)) {
  const publicPath = toPublicPath(file);
  const extension = path.extname(file).toLowerCase();
  const content = await fs.readFile(file);

  assets[publicPath] = {
    body: content.toString("base64"),
    cacheControl: getCacheControl(publicPath),
    contentType: MIME_TYPES[extension] ?? "application/octet-stream",
  };
}

const workerSource = `const ASSETS = ${JSON.stringify(assets)};

function decodeAsset(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function resolveAssetPath(pathname, accept) {
  let normalized;
  try {
    normalized = decodeURIComponent(pathname).replace(/\\/{2,}/g, "/");
  } catch {
    return null;
  }

  if (normalized === "/") return "/index.html";
  if (normalized.endsWith("/")) normalized += "index.html";
  if (ASSETS[normalized]) return normalized;
  if (accept.includes("text/html")) return "/index.html";
  return null;
}

function createHeaders(asset) {
  return {
    "Cache-Control": asset.cacheControl,
    "Content-Type": asset.contentType,
    "Permissions-Policy": "camera=(), geolocation=(), microphone=()",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
  };
}

export default {
  async fetch(request) {
    if (!["GET", "HEAD"].includes(request.method)) {
      return new Response("Method not allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      });
    }

    const url = new URL(request.url);
    const assetPath = resolveAssetPath(
      url.pathname,
      request.headers.get("Accept") ?? "",
    );
    const asset = assetPath ? ASSETS[assetPath] : null;

    if (!asset) {
      return new Response("Not found", {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    return new Response(
      request.method === "HEAD" ? null : decodeAsset(asset.body),
      { status: 200, headers: createHeaders(asset) },
    );
  },
};
`;

await fs.mkdir(server, { recursive: true });
await fs.writeFile(path.join(server, "index.js"), workerSource, "utf8");

const totalBytes = Object.values(assets).reduce(
  (sum, asset) => sum + Buffer.byteLength(asset.body, "base64"),
  0,
);

console.log(`NEXUS production worker built: ${Object.keys(assets).length} assets, ${totalBytes} bytes`);
