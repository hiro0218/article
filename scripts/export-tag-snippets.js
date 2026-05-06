#!/usr/bin/env node
/**
 * @file tag-index.json から VS Code 用タグスニペットを生成するスクリプト
 *
 * @example
 * node scripts/export-tag-snippets.js
 * node scripts/export-tag-snippets.js --input tag-index.json --output .vscode/article-tags.code-snippets
 */
import fs from 'fs/promises';
import path from 'path';
import minimist from 'minimist';

const DEFAULT_INPUT = 'tag-index.json';
const DEFAULT_OUTPUT = '.vscode/article-tags.code-snippets';
const DEFAULT_MIN_COUNT = 10;

function assertTagIndexShape(tags) {
  if (!Array.isArray(tags)) {
    throw new Error('tag-index.json must be an array');
  }

  for (const tag of tags) {
    if (!tag || typeof tag.name !== 'string') {
      throw new Error('tag-index.json items must have a string name');
    }

    if (!Array.isArray(tag.articles)) {
      throw new Error('tag-index.json items must have an articles array');
    }
  }
}

function escapeSnippetBody(value) {
  return value.replace(/\\/g, '\\\\').replace(/\$/g, '\\$').replace(/}/g, '\\}');
}

async function main() {
  const argv = minimist(process.argv.slice(2), {
    alias: {
      i: 'input',
      o: 'output',
      m: 'min-count',
    },
    string: ['input', 'output'],
    default: {
      input: DEFAULT_INPUT,
      output: DEFAULT_OUTPUT,
      'min-count': DEFAULT_MIN_COUNT,
    },
  });

  const tags = JSON.parse(await fs.readFile(argv.input, 'utf-8'));
  const minCount = Number(argv['min-count']);

  if (!Number.isInteger(minCount) || minCount < 1) {
    throw new Error('--min-count must be a positive integer');
  }

  assertTagIndexShape(tags);

  const snippets = Object.fromEntries(
    tags
      .filter((tag) => tag.articles.length >= minCount)
      .map((tag) => [
        `tag: ${tag.name}`,
        {
          scope: 'markdown,yaml',
          prefix: tag.name,
          body: escapeSnippetBody(tag.name),
        },
      ]),
  );
  const content = `${JSON.stringify(snippets, null, 2)}\n`;

  await fs.mkdir(path.dirname(argv.output), { recursive: true });
  await fs.writeFile(argv.output, content, 'utf-8');

  console.log(`exported ${Object.keys(snippets).length} tag snippets to ${argv.output} (min articles: ${minCount})`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
