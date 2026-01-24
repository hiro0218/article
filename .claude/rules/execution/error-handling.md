# エラー対処リファレンス

## 目的

textlint、prettier、link-check、frontmatterに関するよくあるエラーと、その対処法を体系的に整理する。複数ファイルにエラーがある場合の安全な処理方法を提供する。

## エラー発生時の対処フロー

### 1. textlintエラー時の対処

#### 単一ファイルの場合

```bash
# 1. エラー内容を確認
npm run lint:text _posts/target-file.md

# 2. 自動修正を実行
npm run lint:text -- --fix _posts/target-file.md

# 3. 手動修正が必要な場合はファイルを編集
# 4. 再度チェック
npm run lint:text _posts/target-file.md
```

#### 複数ファイルにエラーがある場合の正しい対処法

```bash
# ループ処理で1ファイルずつ確認と修正
for file in _posts/*.md; do
  echo "Checking: $file"
  npm run lint:text -- "$file"                   # 各ファイル個別にチェック
  read -p "Fix this file? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run lint:text -- --fix "$file"          # 確認後、1ファイルずつ修正
  fi
done
```

【重要】 一括修正（`textlint --fix _posts/*.md`）は絶対に実行しないこと。

### 2. prettierエラー時の対処

```bash
# 特定ファイルのフォーマットエラー
npx prettier --write _posts/target-file.md

# フォーマットチェックのみ
npx prettier --check _posts/target-file.md
```

### 3. link-checkエラー時の対処

```bash
# リンクチェック実行
npm run link:check

# エラーが出た場合、該当ファイルを特定して修正
# - 404エラー: リンク先URLを修正
# - タイムアウト: サーバー側の問題の可能性
```

### 4. frontmatterエラー時の対処

【重要】 frontmatterは原則として変更禁止。エラーが出た場合は慎重に対応すること。

正しいfrontmatter形式については、`CLAUDE.md`の「フロントマター」セクションを参照。

エラーの種類:

- `date`フォーマットエラー: UTC形式（ISO 8601）に修正
- `title`形式エラー: `[分野/技術] 説明`パターンに従う
- `tags`形式エラー: YAML配列形式に修正

## よくあるエラーと解決方法

| エラー種別  | エラーメッセージ例             | 対処法                                                             |
| ----------- | ------------------------------ | ------------------------------------------------------------------ |
| textlint    | `である調でなければなりません` | `npm run lint:text -- --fix 対象ファイル.md`で該当ファイルのみ修正 |
| textlint    | `1文が長すぎます（151文字）`   | 文を2つに分割                                                      |
| prettier    | `Formatting error`             | `npm run format`を再実行                                           |
| link-check  | `404 Not Found`                | リンク先URLを修正または削除                                        |
| frontmatter | `Invalid date format`          | UTC形式（ISO 8601）に修正                                          |
| frontmatter | `Missing required field: date` | `date`フィールドを追加                                             |

## textlint個別ルールのエラー対処

### 文体統一のエラー

```markdown
<!-- 修正前 -->

この方法は便利です。

<!-- 修正後 -->

この方法は便利である。
```

### 「一文が長すぎます」エラー

```markdown
<!-- 修正前 -->

この方法はGitHubのリポジトリでCI/CDパイプラインを構築する際に非常に便利で、特にプライベートリポジトリにアクセスする必要がある場合に有効である。

<!-- 修正後 -->

この方法はGitHubのリポジトリでCI/CDパイプラインを構築する際に非常に便利である。特にプライベートリポジトリにアクセスする必要がある場合に有効である。
```

### 「漢字の使用率」エラー

```markdown
<!-- 修正前 -->

情報取得処理実行時間短縮

<!-- 修正後 -->

情報取得の処理実行時間を短縮
```

### 「連続する句点」エラー

```markdown
<!-- 修正前 -->

まず、設定を確認する。次に、実行する。

<!-- 修正後 -->

まず設定を確認し、次に実行する。
```

## prettierエラー対処

### インデントエラー

```markdown
<!-- 修正前 -->

- 項目1
- 項目2

<!-- 修正後 -->

- 項目1
- 項目2
```

### コードブロックのフォーマットエラー

````markdown
<!-- 修正前 -->

```javascript
const data = { name: 'test', value: 123 };
```

<!-- 修正後 -->

```javascript
const data = { name: 'test', value: 123 };
```
````

## link-checkエラー対処

### よくある404エラーの原因

1. **URLの変更**: サイトのリニューアルでURLが変更された
2. **ドメインの変更**: サービスのドメインが変更された
3. **記事の削除**: 参照先の記事が削除された

### 対処方法

```bash
# 1. エラーログを確認
npm run link:check

# 2. 該当ファイルを特定
# 3. リンクを修正または削除
# 4. 再度チェック
npm run link:check
```

## frontmatterエラー対処

### date形式エラー

```yaml
# ❌ 誤り
date: 2025-01-01 12:34:56

# ✅ 正しい（UTC形式）
date: 2025-01-01T03:34:56.000Z
```

### tags形式エラー

```yaml
# ❌ 誤り
tags: Git, GitHub, TypeScript

# ✅ 正しい（YAML配列）
tags:
  - Git
  - GitHub
  - TypeScript
```

### title形式エラー

```yaml
# ❌ 誤り
title: GitのURLに認証情報を埋め込む方法

# ✅ 正しい（分野/技術を含む）
title: '[Git] URLに認証情報を埋め込む方法'
```

## エラー発生時の確認チェックリスト

- [ ] エラーメッセージを正確に確認した
- [ ] 該当ファイルを特定した
- [ ] 1ファイルずつ対処している（ディレクトリ全体を指定していない）
- [ ] 自動修正を試した
- [ ] 手動修正が必要な場合は適切に編集した
- [ ] 修正後に再度チェックした
- [ ] `CLAUDE.md`の「必須遵守事項」を守っている
