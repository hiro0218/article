# コマンド実行リファレンス

## 目的

textlint、prettier、その他のツールを正しく実行するための具体的なコマンドパターンと、絶対に避けるべき誤った使用方法を明示する。

## 人間確認必須（実行前に承認が必要）

- フロントマターの変更（date、title、tagsの編集）※**絶対に変更禁止**
- ファイル名の変更
- `.textlintrc`の編集
- Gitコミット・プッシュ（実行禁止）
- npmパッケージの追加・削除

## textlint実行の必須ルール

### 基本原則

**必ず`npx textlint {filepath}`形式で実行すること。**

#### 理由

1. **意図しない大量変更の防止** - ディレクトリ全体を指定すると、編集意図のないファイルまで一括修正される
2. **各ファイル固有の記述意図の保護** - ファイルごとに意図的な表現や特殊な記法がある
3. **変更内容のレビュー容易化** - 1ファイルずつ修正することで、各変更を確認できる
4. **問題発生時の影響範囲限定** - エラーが発生しても1ファイルのみに影響を限定できる

### ✅ 正しい使用方法（推奨）

```bash
# AI向け（特定ファイルのみ）
npx textlint _posts/202501011234.md
npx textlint --fix _posts/202501011234.md
npx prettier --write _posts/202501011234.md
npm run link:check

# 人間向け（全体チェック）
npm run lint:text
npm run format
npm run link:check
```

### ❌ 絶対禁止パターン

```bash
# 【禁止】全体操作・ディレクトリ指定・ワイルドカード
npm run lint:text                          # 引数なしは禁止
npm run format                             # 全体フォーマットは禁止
npm run lint:text -- --fix _posts/         # ディレクトリ指定は禁止
npx textlint --fix _posts/*.md             # ワイルドカードは禁止
npx textlint --fix .                       # カレントディレクトリ全体は禁止
prettier --write .                         # ディレクトリ全体は禁止
prettier --write _posts/                   # ディレクトリ指定は禁止
textlint --fix _posts/                     # いかなる形式でもディレクトリ指定は禁止
rm _posts/old-article.md                   # ファイル削除

# 【注意】人間が手動で実行する場合のみ
npm run lint:text _posts/202507142152.md
npm run lint:text -- --fix _posts/202507142152.md
```

### 修正時の必須ルール（🔴 絶対遵守）

```bash
# ✅ 正しい使用方法（1ファイルずつ指定）
npm run lint:text -- --fix _posts/202507142152.md
textlint --fix _posts/specific-file.md

# ❌ 絶対禁止（複数ファイル同時修正）
npm run lint:text -- --fix _posts/    # ディレクトリ全体の修正は禁止
textlint --fix _posts/*.md           # ワイルドカード使用は禁止
textlint --fix .                     # カレントディレクトリ全体は禁止
```

**違反時の対応**: 意図しない変更が入った場合、即座に`git restore`でファイルを元に戻し、1ファイルずつ修正をやり直す。

## ファイル指定 vs ディレクトリ指定

### ファイル指定（推奨）

- 対象（1つの具体的なファイルパス）
- 用途（編集中のファイルを修正する際）
- 利点（変更内容が明確、レビュー容易、安全）

```bash
npx textlint --fix _posts/202501011234.md
npx prettier --write _drafts/my-draft.md
```

### ディレクトリ指定（AI使用禁止）

- 対象（ディレクトリ全体またはワイルドカード）
- 用途（人間が全体メンテナンスする際のみ）
- リスク（意図しないファイルの変更、編集意図の破壊）

```bash
# AI実行禁止
npm run lint:text              # 全ファイル対象
textlint --fix _posts/         # ディレクトリ全体対象
prettier --write .             # カレントディレクトリ全体対象
```

## 特定箇所の無視（最小限にとどめる）

```markdown
<!-- textlint-disable -->

無視したい内容

<!-- textlint-enable -->
```

**使用上の注意**:

既存の`textlint-disable`/`textlint-enable`コメントの扱いについては、`CLAUDE.md`の「必須遵守事項」を参照。
