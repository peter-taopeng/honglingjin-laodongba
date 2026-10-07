import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "site");
const output = join(root, "dist");
const required = ["index.html", "styles.css", "app.js", "assets/brand-logo.webp", "assets/hero.webp"];

for (const file of required) {
  if (!existsSync(join(source, file))) throw new Error(`Missing required site file: ${file}`);
}

const html = readFileSync(join(source, "index.html"), "utf8");
const requiredCopy = ["红领巾劳动吧", "陶朋", "17366186124", "学校年度共建", "基地年度共建"];
for (const text of requiredCopy) {
  if (!html.includes(text)) throw new Error(`Missing required content: ${text}`);
}

for (const match of html.matchAll(/(?:src|href)="(assets\/[^"?#]+)"/g)) {
  if (!existsSync(join(source, match[1]))) throw new Error(`Broken local asset reference: ${match[1]}`);
}

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
cpSync(source, output, { recursive: true });
writeFileSync(join(output, ".nojekyll"), "");
console.log(`Static site built successfully at ${output}`);
