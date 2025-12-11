#!/usr/bin/env node
/**
 * @file Markdownファイルのフロントマター内のタグをソートするスクリプト
 *
 * @example
 * node scripts/sort-tags.js _posts/202511240135.md
 */
import fs from 'fs/promises';
import matter from 'gray-matter';

/**
 * 正規表現キャッシュ（パフォーマンス最適化）
 */
const alphaNumRegex = /^[a-zA-Z0-9]/;

/**
 * タグをソートする
 *
 * ソートルール:
 * 1. 英数字で始まるタグを優先
 * 2. 同じカテゴリ内では大文字小文字を区別しない辞書順
 *
 * @param {string[]} tags - ソート対象のタグ配列
 * @returns {string[]} ソート済みタグ配列
 */
function sortTags(tags) {
  return tags.sort((a, b) => {
    const aIsAlphaNum = alphaNumRegex.test(a);
    const bIsAlphaNum = alphaNumRegex.test(b);

    // 英数字優先
    if (aIsAlphaNum !== bIsAlphaNum) {
      return aIsAlphaNum ? -1 : 1;
    }

    // 同じカテゴリ内では大文字小文字を区別しない辞書順
    return a.localeCompare(b, 'ja', { sensitivity: 'base' });
  });
}

/**
 * Markdownファイルのフロントマター内のタグをソートする
 *
 * @param {string} filePath - 処理対象のMarkdownファイルパス
 */
async function sortTagsInFile(filePath) {
  try {
    // ファイル読み込み
    const content = await fs.readFile(filePath, 'utf-8');

    // フロントマターのパース
    const { data, content: body } = matter(content);

    // tagsが存在しない、配列でない、または1個以下の場合はスキップ
    if (!data.tags || !Array.isArray(data.tags) || data.tags.length <= 1) {
      return;
    }

    // タグをソート
    const sortedTags = sortTags([...data.tags]);

    // 変更がない場合はスキップ（ファイルI/Oを回避）
    if (JSON.stringify(data.tags) === JSON.stringify(sortedTags)) {
      return;
    }

    // フロントマターを更新
    data.tags = sortedTags;
    const updated = matter.stringify(body, data);

    // ファイルに書き戻し
    await fs.writeFile(filePath, updated, 'utf-8');
    console.log(`✓ Sorted tags in ${filePath}`);
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    process.exit(1);
  }
}

/**
 * CLI実行エントリーポイント
 */
async function main() {
  const files = process.argv.slice(2);

  if (files.length === 0) {
    console.error('Usage: node sort-tags.js <file1> <file2> ...');
    process.exit(1);
  }

  for (const file of files) {
    await sortTagsInFile(file);
  }
}

main();
