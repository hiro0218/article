#!/usr/bin/env node
import fs from 'fs-extra';
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
 * generate file
 * @param {string} fullpath
 * @param {string} content
 */
function generateFile(fullpath, content) {
  fs.outputFileSync(
    fullpath,
    content,
    { flag: FILE_CREATE_FLAG }, // not overwrite
  );
}

/**
 * create markdown file
 * @param {string} filePath
 * @param {dayjs.Dayjs} timestamp
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
        if (!dayjs(String(hasDate)).isValid()) {
          throw new Error('invalid date');
        }
      }

      const timestamp = hasDate ? dayjs(String(hasDate)) : dayjs();

      createMarkdownFile(process.cwd(), timestamp);
    }
  } catch (error) {
    console.error(error);
  }
})();
