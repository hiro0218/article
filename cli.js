#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import minimist from 'minimist';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import tz from 'dayjs/plugin/timezone.js';

const TIMEZONE = 'Asia/Tokyo';
const POSTS_DIR = '_posts';
const FILENAME_FORMAT = 'YYYYMMDDHHmm';
const FILE_EXTENSION = '.md';
const FILE_CREATE_FLAG = 'wx';

dayjs.extend(utc);
dayjs.extend(tz);
dayjs.tz.setDefault(TIMEZONE);

/**
 * ファイルを生成する（既存ファイルの上書き防止）
 * @param {string} fullpath - 生成するファイルの絶対パス
 * @param {string} content - ファイルに書き込む内容
 * @throws {Error} ファイルが既に存在する場合（EEXIST）
 */
function generateFile(fullpath, content) {
  // 親ディレクトリを再帰的に作成
  const dir = path.dirname(fullpath);
  fs.mkdirSync(dir, { recursive: true });

  // ファイル書き込み（上書き防止）
  fs.writeFileSync(fullpath, content, { flag: FILE_CREATE_FLAG });
}

/**
 * マークダウンファイルを作成する
 * @param {string} filePath - ベースディレクトリのパス（通常はprocess.cwd()）
 * @param {dayjs.Dayjs} timestamp - 記事の作成日時（Asia/Tokyoタイムゾーン）
 * @throws {Error} ファイルが既に存在する場合
 */
function createMarkdownFile(filePath, timestamp) {
  const slug = timestamp.format(FILENAME_FORMAT);
  const fileName = `${slug}${FILE_EXTENSION}`;
  const fullpath = path.join(filePath, POSTS_DIR, fileName);
  // prettier-ignore
  const content =
    [
      "---",
      `title: ""`,
      `date: ${timestamp.utc().format()}`,
      `updated: `,
      `tags: `,
      "---",
    ].join("\n") + "\n";

  generateFile(fullpath, content);

  console.log(`generate: ${fullpath}`);
}

(async () => {
  try {
    const argv = minimist(process.argv.slice(2), {
      alias: {
        n: 'new',
        d: 'date',
      },
    });

    const hasNew = argv._.includes('n') || argv._.includes('new');
    const hasDate = argv.d || argv.date;

    // generate markdown
    if (hasNew) {
      // 妥当性チェック
      if (hasDate) {
        if (!dayjs(hasDate).isValid()) {
          throw new Error('invalid date');
        }
      }

      const timestamp = hasDate ? dayjs(hasDate) : dayjs();

      createMarkdownFile(process.cwd(), timestamp);
    }
  } catch (error) {
    console.error(error);
  }
})();
