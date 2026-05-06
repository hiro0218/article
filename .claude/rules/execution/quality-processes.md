---
paths:
  - '_posts/**/*.md'
  - '_drafts/**/*.md'
---

# 品質プロセス

## 品質チェックの実行順序

1. `npx textlint {filepath}` — 文体・文法
2. `npx prettier --write {filepath}` — フォーマット
3. `npx markdown-link-check {filepath} --config markdown-link-check.config.json` — 対象ファイルのリンク切れ

AIは `npm run link:check` を実行しない。このnpm scriptは `_posts/*.md` 全体を対象にするため、対象外の記事まで検証してしまう。
リンク検証では、編集または確認対象のMarkdownファイルだけを1ファイルずつ指定する。

コミット時は husky + nano-staged で同等のチェックが自動実行される（詳細は `development-setup.md`）。

## 月次レビュー（推奨）

```bash
# 過去1ヶ月のtextlint修正コミット
git log --grep="textlint" --since="1 month ago" --oneline

# 総記事数
find _posts -name "*.md" | wc -l
```

頻出エラーが多いルールは `.textlintrc` の調整を検討する。
