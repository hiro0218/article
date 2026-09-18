---
paths:
  - '_posts/**/*.md'
---

# 開発環境セットアップ

## 記事作成

```bash
npm run new                    # 現在日時で記事作成
npm run new -- -d "2024-01-01 12:34"  # 指定日時で記事作成
```

`cli.js`がAsia/Tokyoタイムゾーンで日時を処理し、`YYYYMMDDHHmm.md`形式のファイル名とUTC形式のフロントマターを自動生成する。

## コミット時の自動化

### husky + nano-staged

コミット時、ステージされたファイルに対して pre-commit フックで以下が自動実行される。

`**/*.md`:

1. `node scripts/sort-tags.js` — フロントマターのタグを整列する
2. `prettier --cache --write` — 自動フォーマット（失敗時はコミット中止）
3. `textlint --cache --fix` — 自動修正付き文法チェック（修正できないエラーはコミット拒否）

`**/*.{js,json,yml,yaml}`:

1. `prettier --cache --write` — 自動フォーマット

リンク検証（markdown-link-check）はコミット時には実行されない。`npx markdown-link-check {filepath} --config markdown-link-check.config.json` で対象ファイルごとに実行する（詳細は `CLAUDE.md` を参照）。

### 設定ファイル

設定の実体は `.husky/pre-commit` と `package.json` の `nano-staged` を参照する。
