# 技術ブログ記事リポジトリ

> 記事タイプを判別し、タイプに応じたルールで執筆し、品質ツールで検証してから完了とする。

## 絶対制約

- フロントマター変更禁止
- ファイル名は `YYYYMMDDHHmm.md`（`npm run new` で自動生成）
- 画像パスは `/images/` で開始
- `textlint-disable`/`textlint-enable` コメントの削除・移動禁止
- 「AI編集禁止」コメント範囲は編集しない
- textlintは `npx textlint {filepath}` で1ファイルずつ実行（ディレクトリ・ワイルドカード禁止）
- AIは `npm run link:check` を実行しない。リンク検証は `npx markdown-link-check {filepath} --config markdown-link-check.config.json` で対象ファイルだけ実行する（ディレクトリ・ワイルドカード禁止）

## 記事解析ルール

記事同士の関連性、既存記事調査、タグ選定、記事群を比較する場合は、本文を横断検索する前に `tag-index.json` を確認する。

- `tag-index.json` は `{ name, articles, relatedTags }` の配列であり、タグは `name` で探す
- 対象記事がある場合: その記事のフロントマターの `tags` を読み、`tag-index.json` から同タグの記事と `relatedTags` を確認する
- 対象タグがある場合: `tag-index.json` の該当タグから `articles` を確認する
- 候補は同タグの記事を優先し、対象記事がある場合は対象記事自身を除外する
- 同タグ候補が多い場合は、複数タグ一致、依頼語・タイトルの一致、`articles` の順で優先する
- 対象タグ名だけのタイトル一致は、同タグ根拠と重複するため追加の優先理由にしない
- `relatedTags` は同タグ候補だけでは足りない場合、または周辺話題まで広げる依頼の場合に展開する
- 記事本文を読むのは、タグ索引で候補を絞った後にする
- `tag-index.json` 全体を回答に貼らず、必要なタグ・記事候補だけを抽出する
- `relatedTags` は関連度順、`articles` は新しい順として扱う
- `tag-index.json` はコミットしないローカル生成物である。初回は `npm install` 後の `postinstall` で生成される
- `tag-index.json` が存在しない、または古い可能性がある場合は `npm run tags:index` で生成してから読む
- push時は `npm run tags:export` で `tag-index.json` とタグスニペットを再生成する

詳細な候補選定が必要な場合は `.claude/skills/article-context-router/SKILL.md` の手順に従う。

## 記事タイプと執筆ルール

記事作成は `npm run new` で開始する。

<!-- textlint-disable ja-technical-writing/no-mix-dearu-desumasu -->

**全記事共通**:「である調」で統一（引用・例文として「です・ます」調を残す場合がある）。見出しは `##` 開始。コードブロックに言語指定必須。

<!-- textlint-enable ja-technical-writing/no-mix-dearu-desumasu -->

**技術記事（~80%）**: タイトルは `[技術名] 説明` 形式。

- SCQA構成で導入部を書く（問題解決型）
- 見出しはメッセージにする（So What化）
- コード例: 問題解決型は5個以上、概念説明型は最小限
- コードブロックにコメントで説明（JSON/YAMLは本文で補足）
- 比較は「従来の方法」→「改善後」の順
- 実行可能なサンプルを提供し、動作確認済みであること
- 一次資料（RFC・公式ドキュメント）で裏付け、`## 参考` にインラインリンクで記載
- セキュリティリスクのある手法: リスク説明 + 適用場面限定 + 安全な代替手段
- 構成テンプレート: `.claude/rules/writing/article-templates.md`

**コラム・雑記（~20%）**: 構成自由。コード例不問（言語指定のみ必須）。

編集パターン: `.claude/rules/writing/editing-examples.md`

## 品質検証

```bash
npx textlint {filepath}
npx prettier --write {filepath}
npx markdown-link-check {filepath} --config markdown-link-check.config.json
```

エラーゼロで完了とする。
