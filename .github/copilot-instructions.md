# 技術ブログ記事リポジトリ

> 記事タイプを判別し、タイプに応じたルールで執筆し、品質ツールで検証してから完了とする。

## 絶対制約

- フロントマター変更禁止
- ファイル名は `YYYYMMDDHHmm.md`（`npm run new` で自動生成）
- 画像パスは `/images/` で開始
- `textlint-disable`/`textlint-enable` コメントの削除・移動禁止
- 「AI編集禁止」コメント範囲は編集しない
- textlintは `npx textlint {filepath}` で1ファイルずつ実行（ディレクトリ・ワイルドカード禁止）

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
- 構成テンプレート → [article-templates.md](.claude/rules/writing/article-templates.md)

**コラム・雑記（~20%）**: 構成自由。コード例不問（言語指定のみ必須）。

編集パターン → [editing-examples.md](.claude/rules/writing/editing-examples.md)

## 品質検証

```bash
npx textlint {filepath}
npx prettier --write {filepath}
npm run link:check
```

エラーゼロで完了とする。
