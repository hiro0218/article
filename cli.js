#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';
import minimist from 'minimist';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import tz from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(tz);
dayjs.tz.setDefault('Asia/Tokyo');

/**
 * generate file
 * @param {string} fullpath
 * @param {string} content
 */
function generateFile(fullpath, content) {
  fs.outputFileSync(
    fullpath,
    content,
    { flag: 'wx' }, // not overwrite
  );
}

/**
 * create markdown file
 * @param {string} filePath
 * @param {dayjs.Dayjs} timestamp
 */
function createMarkdownFile(filePath, timestamp) {
  const slug = timestamp.format('YYYYMMDDHHmm');
  const fileName = `${slug}.md`;
  const fullpath = path.join(filePath, `_posts/${fileName}`);
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
      },
    });

    // generate markdown
    if (argv._.includes('n') || argv._.includes('new')) {
      createMarkdownFile(process.cwd(), dayjs());
    }
  } catch (error) {
    console.error(error);
  }
})();
