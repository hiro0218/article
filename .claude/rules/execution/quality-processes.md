# 品質プロセスリファレンス

## 目的

月次レビュー、品質メトリクス収集、CI/CD統合、改善追跡などの品質監視プロセスを定義する。継続的な品質向上のための具体的な方法を提供する。

## 品質監視と継続改善（実装状態: 推奨）

### 月次レビュープロセス

#### 1. textlintルール違反の統計収集

```bash
# エラー統計の自動収集
git log --grep="textlint" --since="1 month ago" | wc -l

# よくある修正パターンの抽出
git diff --stat --since="1 month ago" -- _posts/*.md | sort -rn | head -10
```

#### 2. 頻出エラーパターンの分析

```bash
# 過去1ヶ月のtextlint修正コミットを確認
git log --grep="textlint" --since="1 month ago" --oneline

# 特定のルール違反の頻度を確認
git log -p --since="1 month ago" -- _posts/*.md | grep "である調" | wc -l
```

#### 3. ルール調整の検討

- 頻出エラーが多いルールは設定を緩和
- 実用上問題ないルールは無効化を検討
- 新たに必要なルールがあれば追加

#### 4. 月次レポートの作成

```markdown
## 品質レポート（YYYY年MM月）

### 統計

- textlint修正コミット数: XX件
- 最も修正の多かったルール: XX
- 平均修正時間: XX分

### 改善提案

- ルールXXの調整を検討
- ドキュメントXXの更新が必要
```

### 品質メトリクスの収集

#### 収集すべきメトリクス

1. **記事品質メトリクス**
   - textlintエラー率（エラー数/総記事数）
   - prettier違反率
   - リンク切れ率

2. **執筆効率メトリクス**
   - 記事作成から公開までの平均時間
   - 修正回数の平均
   - コミット数の平均

3. **メンテナンスメトリクス**
   - 記事更新頻度
   - 古い記事の割合（1年以上更新なし）

#### メトリクス収集スクリプト例

```bash
#!/bin/bash
# metrics.sh - 品質メトリクスを収集

echo "=== 記事品質メトリクス ==="

# 総記事数
total_posts=$(find _posts -name "*.md" | wc -l)
echo "総記事数: $total_posts"

# textlintエラー率
error_count=0
for file in _posts/*.md; do
  if ! npx textlint "$file" > /dev/null 2>&1; then
    ((error_count++))
  fi
done
error_rate=$(echo "scale=2; $error_count * 100 / $total_posts" | bc)
echo "textlintエラー率: ${error_rate}%"

# リンク切れチェック
echo "リンクチェック実行中..."
npm run link:check

# 古い記事の数（1年以上更新なし）
old_posts=$(find _posts -name "*.md" -mtime +365 | wc -l)
echo "古い記事（1年以上更新なし）: $old_posts"
```

## リアルタイム品質監視（実装状態: 部分実装済）

### CI/CD統合（未実装・推奨）

GitHub Actions設定例 (`.github/workflows/quality-check.yml`):

```yaml
name: Quality Check
on:
  pull_request:
    paths:
      - '_posts/**/*.md'
      - '_drafts/**/*.md'

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run textlint
        run: |
          for file in $(git diff --name-only origin/main...HEAD -- '_posts/*.md' '_drafts/*.md'); do
            echo "Checking: $file"
            npx textlint "$file"
          done

      - name: Run prettier check
        run: |
          for file in $(git diff --name-only origin/main...HEAD -- '_posts/*.md' '_drafts/*.md'); do
            npx prettier --check "$file"
          done

      - name: Check links
        run: npm run link:check
        continue-on-error: true # リンクチェックは警告のみ
```

### 品質ゲートの設定

Pull Request作成時に以下をチェック：

1. **必須チェック**（失敗時はマージ不可）
   - textlintエラーがないこと
   - prettierフォーマットが適用されていること
   - frontmatterが正しい形式であること

2. **警告チェック**（失敗時も警告のみ）
   - リンク切れチェック
   - 画像ファイルの存在確認

### Pre-commit Hook（実装済み）

詳細な設定は `.claude/rules/writing/development-setup.md` の「コミット時の自動化」セクションを参照。

## 改善追跡

### 改善提案の管理

GitHub Issuesを使用して改善提案を管理：

```markdown
## Issue例：textlintルールの調整

### 問題

「である調」ルールの違反が月に50回以上発生している。

### 提案

- コラム・雑記記事では「である調」ルールを緩和
- 引用部分では自動適用外とする

### 実装

- `.textlintrc`の調整
- ドキュメントの更新

### 検証

- 修正頻度が減少したか確認
- 記事の読みやすさに影響がないか確認
```

### 改善サイクル

1. **計画（Plan）**
   - 月次レビューで問題点を特定
   - 改善提案をIssueとして作成

2. **実行（Do）**
   - ルール調整やツール設定の変更
   - ドキュメントの更新

3. **確認（Check）**
   - 次回の月次レビューで効果を測定
   - メトリクスの変化を確認

4. **改善（Act）**
   - さらなる調整が必要か判断
   - 成功した改善を標準化

## 品質目標（KPI）

### 短期目標（3ヵ月）

- textlintエラー率: 5%以下
- prettier違反: 0件
- リンク切れ率: 3%以下

### 中期目標（6ヵ月）

- textlint自動修正率: 90%以上
- 記事作成から公開までの平均時間: 2時間以内
- 古い記事の更新率: 月3記事以上

### 長期目標（1年）

- 全記事のtextlint準拠: 100%
- CI/CD統合完了
- 品質メトリクスダッシュボードの構築

## 品質チェックリスト

### 記事公開前チェック

- [ ] textlintエラーがないことを確認
- [ ] prettierフォーマットが適用されていることを確認
- [ ] frontmatterが正しい形式であることを確認
- [ ] 画像パスが正しいことを確認（`/images/`で開始）
- [ ] リンク切れがないことを確認
- [ ] コードブロックに言語指定があることを確認

### 月次レビューチェック

- [ ] textlintルール違反の統計を収集した
- [ ] 頻出エラーパターンを分析した
- [ ] ルール調整の必要性を検討した
- [ ] 品質メトリクスを収集した
- [ ] 改善提案をIssue化した
- [ ] 月次レポートを作成した

### 年次レビューチェック

- [ ] KPI達成状況を確認した
- [ ] 品質プロセスの有効性を評価した
- [ ] ツール設定の見直しを行った
- [ ] ドキュメントを更新した
- [ ] 次年度の目標を設定した

## 推奨ツール

### 品質監視ツール

- textlint（日本語文書の校正）
- prettier（コードフォーマット）
- Markdown-link-check（リンク切れチェック）
- markdownlint（Markdownの構文チェック）

### メトリクス収集ツール

- Git統計（コミット履歴の分析）
- GitHub Actions（CI/CD統合）
- Dashboard（品質メトリクスの可視化、未実装）

### プロジェクト管理ツール

- GitHub Issues（改善提案の管理）
- GitHub Projects（タスク管理）
- GitHub Discussions（チーム内の議論）
