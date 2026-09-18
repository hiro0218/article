# ローカル記事リポジトリ

記事リポジトリで記事を書く・編集するときに読む。

## 既存記事の傾向

タイトル、見出し、タグ、文体は近い既存記事に合わせる。

## 文脈収集

記事本文を読む前に、索引で候補を絞る。

`article-context-router` が存在する場合は、候補記事の絞り込み、タグ候補、関連記事比較の詳細手順をそちらに委譲する。このファイルでは、作業モードに応じた索引の扱いだけを定める。

作業モードで索引の扱いを分ける。

- 読み取り専用: 既存の `tag-index.json` / `article-index.json` だけを読む。索引がない、または古い可能性がある場合は、`前提` または `保存時の確認事項` として報告する。再生成しない。
- 保存あり: `tag-index.json` または `article-index.json` が存在しない、または古い可能性がある場合は次を実行する。

```bash
npm run tags:export
```

索引再生成は `npm run tags:export` を使う。`npm run tags:index` は `tag-index.json` しか生成しない (`article-index.json` とタグスニペットが更新されない) ため、単独では使わない。

## 文体

文体は `.claude/rules/writing/writing-voice.md` に従う。AI 風表現の検出と rewrite は `avoid-ai-writing` に委譲する。

## 執筆ルール

記事リポジトリの `AGENTS.md`、`CLAUDE.md`、writing rules、`article-foundation-editor` がある場合は、それらの制約を優先する。最低限、以下は守る。

- 絶対制約は CLAUDE.md に従う。
- 非技術記事では、技術記事向けのコード例数、検証環境、再現性の要件を機械的に適用しない。

## 検証

検証は CLAUDE.md『品質検証』の3コマンドを対象ファイルだけに実行する。
