#!/usr/bin/env node
/**
 * @file _posts 配下のMarkdownからタグ名・記事一覧・関連タグを生成するスクリプト
 *
 * @example
 * node scripts/export-tags.js
 * node scripts/export-tags.js --output tag-index.json
 */
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import minimist from 'minimist';

const DEFAULT_POSTS_DIR = '_posts';
const DEFAULT_OUTPUT = 'tag-index.json';
const MARKDOWN_EXTENSION = '.md';
const JSON_EXTENSION = '.json';
const YAML_EXTENSIONS = new Set(['.yml', '.yaml']);
const RELATED_TAG_LIMIT = 15;
const alphaNumRegex = /^[a-zA-Z0-9]/;

/**
 * tag-index.json の生成仕様:
 * - 各タグは articles.length の降順、同数ならタグ名順で並べる
 * - articles はファイル名の日時降順で並べる
 * - relatedTags は共起件数、全体の記事数、タグ名の順に並べた上位だけを出す
 */
function compareTagNames(a, b) {
  const aIsAlphaNum = alphaNumRegex.test(a);
  const bIsAlphaNum = alphaNumRegex.test(b);

  if (aIsAlphaNum !== bIsAlphaNum) {
    return aIsAlphaNum ? -1 : 1;
  }

  return a.localeCompare(b, 'ja', { sensitivity: 'base' });
}

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

function incrementCount(map, key) {
  map.set(key, (map.get(key) || 0) + 1);
}

function incrementNestedCount(map, key, nestedKey) {
  if (!map.has(key)) {
    map.set(key, new Map());
  }

  incrementCount(map.get(key), nestedKey);
}

function sortRelatedTags(tag, tagCooccurrences, tagCounts) {
  const cooccurrences = tagCooccurrences.get(tag);

  if (!cooccurrences) {
    return [];
  }

  return [...cooccurrences.entries()]
    .sort(([aName, aCount], [bName, bCount]) => {
      const countDiff = bCount - aCount;

      if (countDiff !== 0) {
        return countDiff;
      }

      const globalCountDiff = (tagCounts.get(bName) || 0) - (tagCounts.get(aName) || 0);

      if (globalCountDiff !== 0) {
        return globalCountDiff;
      }

      return compareTagNames(aName, bName);
    })
    .slice(0, RELATED_TAG_LIMIT)
    .map(([name]) => name);
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

  return files.flat().sort((a, b) => a.localeCompare(b, 'ja'));
}

async function collectTags(postsDir) {
  const files = await findMarkdownFiles(postsDir);
  const tagCounts = new Map();
  const tagArticles = new Map();
  const tagCooccurrences = new Map();
  const warnings = [];

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    const { data } = matter(content);

    if (data.tags === undefined || data.tags === null) {
      continue;
    }

    if (!Array.isArray(data.tags)) {
      warnings.push(`${file}: tags is not an array`);
      continue;
    }

    const seenTags = new Set();

    for (const value of data.tags) {
      if (typeof value !== 'string') {
        warnings.push(`${file}: non-string tag ignored`);
        continue;
      }

      const tag = value.trim();

      if (tag.length === 0) {
        warnings.push(`${file}: empty tag ignored`);
        continue;
      }

      if (seenTags.has(tag)) {
        warnings.push(`${file}: duplicate tag ignored: ${tag}`);
        continue;
      }

      seenTags.add(tag);
    }

    for (const tag of seenTags) {
      incrementCount(tagCounts, tag);

      if (!tagArticles.has(tag)) {
        tagArticles.set(tag, []);
      }

      tagArticles.get(tag).push(file);

      for (const relatedTag of seenTags) {
        if (tag !== relatedTag) {
          incrementNestedCount(tagCooccurrences, tag, relatedTag);
        }
      }
    }
  }

  const tags = [...tagCounts.keys()]
    .map((name) => ({
      name,
      articles: tagArticles.get(name).sort(compareArticlePaths),
      relatedTags: sortRelatedTags(name, tagCooccurrences, tagCounts),
    }))
    .sort((a, b) => b.articles.length - a.articles.length || compareTagNames(a.name, b.name));

  return {
    source: `${postsDir}/**/*.md`,
    totalPosts: files.length,
    totalTags: tags.length,
    tags,
    warnings,
  };
}

function formatMarkdown(report) {
  const lines = ['# タグ一覧', ''];

  for (const tag of report.tags) {
    lines.push(`- ${tag.name}`);

    if (tag.articles.length > 0) {
      lines.push('  - articles:');

      for (const article of tag.articles) {
        lines.push(`    - ${article}`);
      }
    }

    if (tag.relatedTags.length > 0) {
      lines.push(`  - relatedTags: ${tag.relatedTags.join(', ')}`);
    }
  }

  return `${lines.join('\n')}\n`;
}

function formatJson(report) {
  return `${JSON.stringify(report.tags, null, 2)}\n`;
}

function formatYaml(report) {
  const lines = ['tags:'];

  for (const tag of report.tags) {
    lines.push(`  - name: ${JSON.stringify(tag.name)}`);
    lines.push('    articles:');

    for (const article of tag.articles) {
      lines.push(`      - ${JSON.stringify(article)}`);
    }

    lines.push('    relatedTags:');

    for (const relatedTag of tag.relatedTags) {
      lines.push(`      - ${JSON.stringify(relatedTag)}`);
    }
  }

  return `${lines.join('\n')}\n`;
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
  const report = await collectTags(postsDir);
  const extension = path.extname(output);
  const content = YAML_EXTENSIONS.has(extension)
    ? formatYaml(report)
    : extension === JSON_EXTENSION
      ? formatJson(report)
      : formatMarkdown(report);

  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, content, 'utf-8');

  for (const warning of report.warnings) {
    console.warn(`warning: ${warning}`);
  }

  console.log(`exported ${report.totalTags} tags to ${output}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
