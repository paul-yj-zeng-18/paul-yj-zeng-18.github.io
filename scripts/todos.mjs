// Lists every placeholder ("TODO..." string) in profile.json that would show on
// the page. `--strict` exits non-zero if any remain (use before launch).
import { readFileSync } from "node:fs";

export function findTodos(node, path = "", out = []) {
  if (node && typeof node === "object") {
    if (node.hidden) return out;
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith("_")) continue;
      findTodos(v, path ? `${path}.${k}` : k, out);
    }
  } else if (typeof node === "string" && node.trim().startsWith("TODO")) {
    out.push({ path, text: node });
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const todos = findTodos(JSON.parse(readFileSync("profile.json", "utf8")));
  for (const { path, text } of todos) console.log(`${path.padEnd(34)} ${text}`);
  console.log(`\n${todos.length} placeholder(s).`);
  if (process.argv.includes("--strict") && todos.length) process.exit(1);
}
