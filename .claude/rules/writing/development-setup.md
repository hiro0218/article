---
paths:
  - '_posts/**/*.md'
---

# 開発環境セットアップ

## 概要

このドキュメントは、記事執筆環境のセットアップと自動化ツールの設定について説明する。

## 記事作成

```bash
npm run new                    # 現在日時で記事作成
npm run new -- -d "2024-01-01 12:34"  # 指定日時で記事作成
```

`cli.js`がAsia/Tokyoタイムゾーンで日時を処理し、`YYYYMMDDHHmm.md`形式のファイル名とUTC形式のフロントマターを自動生成する。

## 記事品質チェック

コマンドの詳細は `.claude/rules/execution/command-reference.md` を参照。

## コミット時の自動化

### husky + nano-staged

コミット時に以下の処理が自動実行される。

1. Prettierで自動フォーマット（失敗時はコミット中止）
2. textlintで文法チェック（エラー時はコミット拒否）
3. Markdown-link-checkでリンク検証（404エラー時は警告）

### 設定ファイル

#### `.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx nano-staged
```

#### `package.json`の`nano-staged`設定

```json
{
  "nano-staged": {
    "*.md": ["prettier --write", "textlint --fix"]
  }
}
```

### 動作の詳細

#### 1. Prettier自動フォーマット

コミット対象のMarkdownファイルに対して、Prettierが自動的にフォーマットを適用する。

- 成功時（フォーマット適用後、次のステップへ）
- 失敗時（コミットが中止される）

#### 2. textlint文法チェック

コミット対象のMarkdownファイルに対して、textlintが文法チェックを実行する。

- 成功時（チェック通過後、コミット完了）
- 失敗時（コミットが拒否され、エラーメッセージが表示される）

#### 3. Markdown-link-check

リンク切れをチェックする。

- 404エラー時（警告が表示されるが、コミットは継続可能）

### トラブルシューティング

#### コミットが中止される場合

1. エラーメッセージを確認
2. 該当ファイルを修正
3. 再度コミットを実行

```bash
# エラーを確認
git status

# ファイルを修正後、再コミット
git add <修正したファイル>
git commit -m "コミットメッセージ"
```

#### huskyのフックを一時的にスキップする場合

注意：通常はスキップすべきでない。やむを得ない場合のみ使用する。

```bash
git commit --no-verify -m "コミットメッセージ"
```

## 必要なパッケージ

### 主要パッケージ

- `husky`: Gitフックの管理
- `nano-staged`: ステージされたファイルに対してコマンド実行
- `prettier`: コードフォーマッター
- `textlint`: 文書校正ツール
- `markdown-link-check`: リンク切れチェック

### インストール

```bash
npm install
```

すべての依存パッケージが`package.json`に定義されているため、`npm install`で一括インストールされる。

## textlint設定

textlintの詳細な設定は`.textlintrc`を参照。

主な適用ルール：

- 日本語技術文書向けプリセット
- AI記事向けルール
- プロジェクト固有の許可語彙

## 参照

- メインガイドライン: `CLAUDE.md`
- コマンド実行リファレンス: `.claude/rules/execution/command-reference.md`
- textlint設定: `.textlintrc`
