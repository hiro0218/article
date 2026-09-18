---
paths:
  - '_posts/**/*.md'
  - '_drafts/**/*.md'
---

# コマンド実行リファレンス

## 正しいパターン

実行してよいのは CLAUDE.md『品質検証』の3コマンドと `npx textlint --fix {filepath}` を、1ファイル指定で実行する形だけである。

## 禁止パターン

`npm run lint:text` / `format` / `link:check` は `package.json` で `_posts` 全体を対象にしており、スクリプト名からは判別できない。

```bash
npx textlint _posts/              # ディレクトリ指定
npx textlint _posts/*.md          # ワイルドカード
npx textlint --fix .              # カレントディレクトリ全体
npx prettier --write _posts/      # ディレクトリ指定
npm run lint:text                  # 引数なし全体実行
npm run format                     # 全体フォーマット
npm run link:check                 # 全記事リンク検証
npx markdown-link-check _posts/*.md --config markdown-link-check.config.json  # ワイルドカード
```

複数ファイルが書き換わった場合は `git diff --stat` で影響範囲を確認し、対象外ファイルの変更は Edit で個別に戻す。`git restore` / `git checkout -- <path>` は未コミットの正当な差分ごと巻き戻すため使わない。
