---
paths:
  - '_posts/**/*.md'
---

# コード例記述パターン

## 概要

技術記事でコード例を記述する際の推奨パターンと具体例を提供する。

## 推奨パターン

### 1. 基本例 → 応用例 → エッジケース

段階的に複雑さを増していく構成。読者が理解しやすい順序で提示する。

### 2. 従来の方法 → 改善後

比較パターン。従来の方法の問題点を示し、改善後の利点を明確にする。

### 3. 実際のプロジェクトで使用できる実践的なコード

理論だけでなく、コピー&ペーストで使えるサンプルコードを提供する。

## 具体例

### 基本的な使い方

````markdown
## 実装

### 基本的な使い方

```javascript
// 基本的なパターン
const result = doSomething();
```
````

### 応用例

```javascript
// エラーハンドリング付き
try {
  const result = doSomething();
  // 処理
} catch (error) {
  console.error(error);
}
```

### 従来の方法との比較

従来の方法:

```javascript
// 冗長な記述
const data = getData();
if (data !== null && data !== undefined) {
  processData(data);
}
```

改善後:

```javascript
// Null合体演算子を使用
const data = getData();
data && processData(data);
```

## デモ・サンプルリポジトリ

実際に動作するデモやサンプルコードへのリンクを提供する。

- CodePen（ブラウザで即座に試せるデモ）
- StackBlitz（本格的なプロジェクト環境）
- GitHubリポジトリ（完全なプロジェクトコード）

### 記載例

```markdown
## デモ

以下のCodePenで実際の動作を確認できる：

[デモを見る](https://codepen.io/username/pen/xxxxx)

完全なコードはGitHubリポジトリで公開している：

[サンプルリポジトリ](https://github.com/username/sample-project)
```

## コードブロックの必須要件

### 言語指定

必ず言語を指定する。

````markdown
<!-- ✅ 推奨 -->

```javascript
const data = { name: 'test' };
```

<!-- ❌ 避ける -->

```
const data = { name: "test" };
```
````

### コメントの追加

重要な箇所にはコメントを追加：

```javascript
// データを取得
const result = doSomething();

// 取得したデータを処理
processData(result);
```

### 比較パターンの順序

「従来の方法」→「改善後」の順で表示：

````markdown
従来の方法:

\```javascript
// 冗長な記述
\```

改善後:

\```javascript
// 簡潔な記述
\```
````

## 技術記事の必須要件（2020年以降の標準）

- 言語指定を必ず行う（` ```javascript `、` ```typescript `、` ```bash `等）
- コメントで説明を追加（特に重要な箇所）
- 最低5個以上のコード例を含める
- 実行可能なサンプルを提供（可能な限り）

## コラム・雑記の場合

- コードブロックを含む場合は言語指定する
- コード例の個数は不問

## 参照

- メインガイドライン: `CLAUDE.md`
- 記事構成テンプレート: `.claude/rules/writing/article-templates.md`
