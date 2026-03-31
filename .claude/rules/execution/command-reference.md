---
paths:
  - '_posts/**/*.md'
  - '_drafts/**/*.md'
---

# コマンド実行リファレンス

## 正しいパターン

```bash
npx textlint _posts/202501011234.md          # チェック
npx textlint --fix _posts/202501011234.md     # 自動修正
npx prettier --write _posts/202501011234.md   # フォーマット
npm run link:check                            # リンク切れ（全体）
```

## 禁止パターン

```bash
npx textlint _posts/              # ディレクトリ指定
npx textlint _posts/*.md          # ワイルドカード
npx textlint --fix .              # カレントディレクトリ全体
npx prettier --write _posts/      # ディレクトリ指定
npm run lint:text                  # 引数なし全体実行
npm run format                     # 全体フォーマット
```

違反時は `git restore` で戻し、1ファイルずつやり直す。

## 人間確認必須

- フロントマターの変更
- ファイル名の変更
- `.textlintrc` の編集
- npm パッケージの追加・削除
