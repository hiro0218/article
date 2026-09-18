---
name: article-context-router
description: tag-index.json を使って、記事調査・関連記事候補・タグ選定・記事群比較の前に読むべき記事候補を絞るスキル。本文横断検索の前にタグ索引で候補を作る。
---

# Article Context Router

記事本文を広く読む前に、`tag-index.json` で候補記事を絞る。記事間の関連性は内部リンクではなくタグだけを根拠にする。

## 索引の契約

`tag-index.json` は配列である。タグは `name` で探す。

```json
{
  "name": "TypeScript",
  "articles": ["_posts/202605021758.md"],
  "relatedTags": ["JavaScript", "設計"]
}
```

- `articles`: 新しい順
- `relatedTags`: 関連度順
- 件数は `articles.length` から読む

`article-index.json` も配列である。候補記事のタイトルとタグは、本文を読む前にここで確認する。

```json
{
  "path": "_posts/202605021758.md",
  "title": "...",
  "date": "...",
  "updated": "...",
  "tags": ["..."]
}
```

## ワークフロー

1. 対象が記事ならフロントマターの `tags` だけ読む。対象がタグなら `tag-index.json` の `name` で探す。
2. 同タグの `articles` から候補を最大5件出す。対象記事自身は除外する。
3. 優先順位: 複数の対象タグに出る記事 → 依頼語・対象記事タイトルに近い記事 → `articles` の順。対象タグ名だけのタイトル一致は追加の優先理由にしない。
4. 同タグ候補が少ない、または周辺話題まで求められた場合だけ `relatedTags` 上位3タグへ1階層展開し、タグごと最大3件。その先の `relatedTags` はたどらない。
5. 候補のタイトルとタグを `article-index.json` で確認してから本文を読む。「重複」「前提」「補完」は本文を読むまで仮分類とし、「重複なし」と確定しない。

## コマンド例

タグから候補を確認する。

```bash
node -e "const tags=require('./tag-index.json'); console.log(JSON.stringify(tags.find(t=>t.name==='TypeScript'), null, 2));"
```

候補記事のタイトルとタグを確認する。

```bash
node -e "const arts=require('./article-index.json'); const paths=['_posts/202605021758.md']; console.log(JSON.stringify(arts.filter(a=>paths.includes(a.path)), null, 2));"
```

## 出力ルール

- `tag-index.json` / `article-index.json` の全体を貼らない。
- 候補の根拠になったタグ名を示す。
- `articles` は新しい順、`relatedTags` は関連度順として説明する。
- 索引が無い・古い可能性がある場合の再生成可否は作業モードで決まる(`.claude/skills/article-writer/references/article-repository.md` の索引の扱い)。
