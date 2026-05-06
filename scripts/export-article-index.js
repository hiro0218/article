#!/usr/bin/env node
/**
 * @file _posts 配下のMarkdownから記事単位の軽量インデックスを生成するスクリプト
 *
 * @example
 * node scripts/export-article-index.js
 * node scripts/export-article-index.js --output article-index.json
 */
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import minimist from 'minimist';

const DEFAULT_POSTS_DIR = '_posts';
const DEFAULT_OUTPUT = 'article-index.json';
const MARKDOWN_EXTENSION = '.md';

/**
 * article-index.json の生成仕様:
 * - 各記事はファイル名の日時降順で並べる
 * - path, title, date, updated, tags を出す
 */
function getArticleSortKey(file) {
  const slug = path.basename(file, MARKDOWN_EXTENSION);

  if (/^\d{12,14}$/.test(slug)) {
    return slug.padEnd(14, '0');
  }

  return '';
}

function compareArticlePaths(a, b) {
  const aKey = getArticleSortKey(a);
  const bKey = getArticleSortKey(b);

  if (aKey !== bKey) {
    return bKey.localeCompare(aKey, 'ja');
  }

  return a.localeCompare(b, 'ja');
}

async function findMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return findMarkdownFiles(fullPath);
      }

      if (entry.isFile() && path.extname(entry.name) === MARKDOWN_EXTENSION) {
        return [fullPath];
      }

      return [];
    }),
  );

  return files.flat().sort(compareArticlePaths);
}

function normalizeText(value) {
  return String(value).replace(/\s+/g, ' ').trim();
}

function normalizeDate(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }

  return String(value).trim() || null;
}

function normalizeTags(value, file, warnings) {
  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    warnings.push(`${file}: tags is not an array`);
    return [];
  }

  const tags = [];
  const seenTags = new Set();

  for (const item of value) {
    if (typeof item !== 'string') {
      warnings.push(`${file}: non-string tag ignored`);
      continue;
    }

    const tag = item.trim();

    if (tag.length === 0) {
      warnings.push(`${file}: empty tag ignored`);
      continue;
    }

    if (seenTags.has(tag)) {
      warnings.push(`${file}: duplicate tag ignored: ${tag}`);
      continue;
    }

    seenTags.add(tag);
    tags.push(tag);
  }

  return tags;
}

async function collectArticles(postsDir) {
  const files = await findMarkdownFiles(postsDir);
  const warnings = [];

  const articles = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(file, 'utf-8');
      const { data } = matter(raw);
      const title = normalizeText(data.title ?? '');

      if (title.length === 0) {
        warnings.push(`${file}: title is empty`);
      }

      return {
        path: file,
        title,
        date: normalizeDate(data.date),
        updated: normalizeDate(data.updated),
        tags: normalizeTags(data.tags, file, warnings),
      };
    }),
  );

  return {
    totalPosts: files.length,
    articles,
    warnings,
  };
}

function formatJson(report) {
  return `${JSON.stringify(report.articles, null, 2)}\n`;
}

async function main() {
  const argv = minimist(process.argv.slice(2), {
    alias: {
      o: 'output',
      p: 'posts',
    },
    string: ['output', 'posts'],
    default: {
      output: DEFAULT_OUTPUT,
      posts: DEFAULT_POSTS_DIR,
    },
  });

  const output = argv.output;
  const postsDir = argv.posts;
  const report = await collectArticles(postsDir);

  const dir = path.dirname(output);

  if (dir && dir !== '.') {
    await fs.mkdir(dir, { recursive: true });
  }

  await fs.writeFile(output, formatJson(report), 'utf-8');

  for (const warning of report.warnings) {
    console.warn(`warning: ${warning}`);
  }

  console.log(`exported ${report.totalPosts} articles to ${output}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
