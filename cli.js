#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";
import minimist from "minimist";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc.js';
import tz from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(tz);
dayjs.tz.setDefault('Asia/Tokyo');

function generateFile(fullpath, content) {
  fs.outputFileSync(
    fullpath,
    content,
    { flag: "wx" } // not overwrite
  );
}

(async () => {
  try {
    const argv = minimist(process.argv.slice(2), {
      alias: {
        n: "new",
      },
    });

    // generate markdown
    if (argv._.includes("n") || argv._.includes("new")) {
      const now = dayjs();
      const slug = now.format("YYYYMMDDHHmm");
      const fileName = `${slug}.md`;
      const filepath = path.join(process.cwd(), `_posts/${fileName}`);
      const content =
        [
          "---",
          `title: ""`,
          `date: ${now.utc().format()}`,
          `updated: `,
          `categories: `,
          `tags: `,
          "---",
        ].join("\n") + "\n";

      generateFile(filepath, content);

      console.log(`generate: ${filepath}`);
    }
  } catch (error) {
    console.error(error);
  }
})();
