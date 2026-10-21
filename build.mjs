// Build: profile.json -> dist/index.html (+ styles and public/ assets).
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, rmSync } from "node:fs";
import { render } from "./src/render.mjs";
import { findTodos } from "./scripts/todos.mjs";

export function build() {
  const profile = JSON.parse(readFileSync("profile.json", "utf8"));
  rmSync("dist", { recursive: true, force: true });
  mkdirSync("dist", { recursive: true });
  if (existsSync("public")) cpSync("public", "dist", { recursive: true });
  cpSync("src/styles.css", "dist/styles.css");
  writeFileSync("dist/index.html", render(profile));
  const todos = findTodos(profile);
  console.log(`Built dist/index.html · ${todos.length} placeholder(s) left (npm run todos to list)`);
}

if (import.meta.url === `file://${process.argv[1]}`) build();
