---
paths:
  - '_posts/**/*.md'
  - '_drafts/**/*.md'
---

# エラー対処リファレンス

## エラー早見表

| エラー種別  | エラー例                       | 対処法                                 |
| ----------- | ------------------------------ | -------------------------------------- |
| textlint    | `である調でなければなりません` | `npx textlint --fix {file}` で自動修正 |
| textlint    | `1文が長すぎます（151文字）`   | 文を2つに分割                          |
| textlint    | `漢字の使用率`                 | 助詞・接続詞をひらがなに               |
| textlint    | `連続する句点`                 | 文を結合するか句点を削除               |
| prettier    | `Formatting error`             | `npx prettier --write {file}`          |
| link-check  | `404 Not Found`                | リンク先URLを修正または削除            |
| frontmatter | `Invalid date format`          | UTC形式に修正                          |
| frontmatter | `Missing required field`       | 必須フィールドを追加                   |

## textlint修正例

### 文が長すぎる

```markdown
<!-- 修正前 -->

この方法はGitHubのリポジトリでCI/CDパイプラインを構築する際に非常に便利で、特にプライベートリポジトリにアクセスする必要がある場合に有効である。

<!-- 修正後 -->

この方法はGitHubのリポジトリでCI/CDパイプラインを構築する際に便利である。特にプライベートリポジトリにアクセスする必要がある場合に有効である。
```

### 漢字使用率が高い

```markdown
<!-- 修正前 -->

情報取得処理実行時間短縮

<!-- 修正後 -->

情報取得の処理実行時間を短縮
```

## frontmatter修正例

### date形式

```yaml
# 誤
date: 2025-01-01 12:34:56

# 正（UTC形式）
date: 2025-01-01T03:34:56.000Z
```

### tags形式

```yaml
# 誤
tags: Git, GitHub, TypeScript

# 正（YAML配列）
tags:
  - Git
  - GitHub
  - TypeScript
```

### title形式

```yaml
# 誤
title: GitのURLに認証情報を埋め込む方法

# 正
title: '[Git] URLに認証情報を埋め込む方法'
```
