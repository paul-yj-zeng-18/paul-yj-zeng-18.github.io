// Local preview: builds, serves dist/ on http://localhost:4321, rebuilds on change.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { watch } from "node:fs";
import { extname, join, normalize } from "node:path";
import { build } from "../build.mjs";

const types = { ".html": "text/html", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".pdf": "application/pdf" };

const safeBuild = () => { try { build(); } catch (e) { console.error(e.message); } };
safeBuild();
for (const target of ["profile.json", "src", "public"]) {
  try { watch(target, { recursive: true }, safeBuild); } catch {}
}

createServer(async (req, res) => {
  let path = normalize(decodeURIComponent(req.url.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  if (path.endsWith("/")) path += "index.html";
  try {
    const body = await readFile(join("dist", path));
    res.writeHead(200, { "content-type": types[extname(path)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404).end("Not found");
  }
}).listen(4321, () => console.log("Preview at http://localhost:4321"));
