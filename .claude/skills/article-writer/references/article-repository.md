# ローカル記事リポジトリ

記事リポジトリで記事を書く・編集するときに読む。記事リポジトリのルートは、ユーザーが指定した作業ディレクトリまたは現在の作業ディレクトリとして扱う。

## 既存記事の傾向

既存記事の傾向は、固定値ではなく `article-index.json`、`tag-index.json`、最近の記事から確認する。

- タイトル、見出し、タグ、文体は近い既存記事に合わせる。
- 技術記事、調査記事、設計論、雑記、レビュー、感想、短いメモなど、既存記事の型を観測して選ぶ。
- 外部情報を根拠にする記事では、記事リポジトリの既存慣習に合わせて参考リンクを置く。

## 文脈収集

記事本文を読む前に、索引で候補を絞る。

`article-context-router` が存在する場合は、候補記事の絞り込み、タグ候補、関連記事比較の詳細手順をそちらに委譲する。このファイルでは、作業モードに応じた索引の扱いだけを定める。

作業モードで索引の扱いを分ける。

- 読み取り専用: 既存の `tag-index.json` / `article-index.json` だけを読む。索引がない、または古い可能性がある場合は、`前提` または `保存時の確認事項` として報告する。再生成しない。
- 保存あり: `tag-index.json` または `article-index.json` が存在しない、または古い可能性がある場合は次を実行する。

```bash
npm run tags:export
```

索引再生成は `npm run tags:export` を使う。別のローカルスキルや古い手順に `npm run tags:index` とあっても、このリポジトリでは `AGENTS.md` の `npm run tags:export` を優先する。

`article-context-router` が存在しない場合だけ、`article-index.json` で候補記事のタイトルとタグを確認し、`tag-index.json` で同タグ・関連タグの記事を最小限に絞る。索引ファイル全体を回答に貼らない。

## 文体

リポジトリの文体に合わせる。

- `だ・である` 調で書く。
- 短く断定する。
- 主観より観測結果・検証結果を優先する。
- 抽象語より具体的な名詞を使う。
- 汎用的な AI 風の導入や大げさな評価を避ける。細かい検出と rewrite は `avoid-ai-writing` に委譲する。

## 執筆ルール

記事リポジトリの `AGENTS.md`、`CLAUDE.md`、writing rules、`article-foundation-editor` がある場合は、それらの制約を優先する。最低限、以下は守る。

- 既存記事のフロントマターは編集しない。
- 新規記事はリポジトリ指定の生成コマンドで作る。指定がある場合はファイル名を手で作らない。
- `textlint-disable` / `textlint-enable` コメントを削除・移動しない。
- AI 編集禁止範囲を編集しない。
- コードフェンスには言語を指定する。
- 非技術記事では、技術記事向けのコード例数、検証環境、再現性の要件を機械的に適用しない。

## 検証

検証は対象ファイルだけに実行する。

```bash
npx textlint path/to/article.md
npx prettier --write path/to/article.md
npx markdown-link-check path/to/article.md --config markdown-link-check.config.json
```

記事検証で `npm run link:check` は実行しない。ディレクトリやワイルドカードを対象にした textlint も実行しない。
