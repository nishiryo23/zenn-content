#!/usr/bin/env node
// 記事に画像を追加するヘルパー。
// 使い方: node scripts/add-image.mjs <slug> <source-path> [alt] [caption] [--force]
// - images/<slug>/<basename> へコピー(既存はエラー。--forceで上書き)
// - 記事に貼れるMarkdown断片を stdout に出力

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const REPO = "nishiryo23/zenn-content";
const BRANCH = "main";

const argv = process.argv.slice(2);
const force = argv.includes("--force");
const positional = argv.filter((a) => a !== "--force");
const [slug, srcPath, alt, caption] = positional;

if (!slug || !srcPath) {
  console.error("Usage: node scripts/add-image.mjs <slug> <source-path> [alt] [caption] [--force]");
  process.exit(1);
}
if (!/^[a-z0-9]{12,50}$/.test(slug)) {
  console.error(`Invalid slug (Zenn要件: 英小文字数字12〜50字): ${slug}`);
  process.exit(1);
}
if (!fs.existsSync(srcPath)) {
  console.error(`Not found: ${srcPath}`);
  process.exit(1);
}

const filename = path.basename(srcPath);
const destDir = path.join(ROOT, "images", slug);
const destPath = path.join(destDir, filename);

if (fs.existsSync(destPath) && !force) {
  console.error(`Already exists (use --force to overwrite): ${destPath}`);
  process.exit(1);
}

fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(srcPath, destPath);

const url = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/images/${slug}/${filename}`;
const altText = alt || filename.replace(/\.[^.]+$/, "");
const md = caption
  ? `![${altText}](${url})\n*${caption}*`
  : `![${altText}](${url})`;

console.error(`\n✓ Copied: ${path.relative(ROOT, destPath)}\n`);
console.log(md);
