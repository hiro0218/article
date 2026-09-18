---
paths:
  - '_posts/**/*.md'
  - '_drafts/**/*.md'
---

# エラー対処リファレンス

## textlint

`npx textlint --fix {filepath}` で直らないルールがある。次の3つは fixer を持たないため本文を手で直す。エラーは本文側で解消し、`.textlintrc` の allowlist 追加やルール無効化で回避しない(必要ならユーザーへ提案する)。

| エラーメッセージ(抜粋)                                            | ルール(設定値)                   | 対処                                                                           |
| ----------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------ |
| `"である"調 でなければなりません`                                 | no-mix-dearu-desumasu            | 該当文をである調に書き換える。引用・例文として残すべき文ならユーザーに確認する |
| `sentence length(151) exceeds the maximum sentence length of 150` | sentence-length(max 150)         | 文を分割する                                                                   |
| `漢字が11つ以上連続しています: 情報取得処理実行時間短縮`          | max-kanji-continuous-len(max 10) | 助詞を挟む(例: 情報取得の処理実行時間を短縮)                                   |

## frontmatter

フロントマターは編集しない。新規記事のタイトル・タグを報告する際は次の形式で示す。

### tags（YAML配列）

```yaml
# 誤
tags: Git, GitHub, TypeScript

# 正（YAML配列）
tags:
  - Git
  - GitHub
  - TypeScript
```

### title

```yaml
# 誤
title: GitのURLに認証情報を埋め込む方法

# 正
title: '[Git] URLに認証情報を埋め込む方法'
```

`[` で始まる値は YAML でフロー配列として解釈されるためシングルクォートで囲む。
