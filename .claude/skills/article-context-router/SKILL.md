---
name: article-context-router
description: tag-index.json を使って、記事調査・関連記事候補・タグ選定・記事群比較の前に読むべき記事候補を絞るスキル。本文横断検索の前にタグ索引で候補を作る。
---

# Article Context Router

記事本文を広く読む前に、`tag-index.json` で候補記事を絞る。記事間の関連性は内部リンクではなくタグだけを根拠にする。

## 使う場面

- 関連記事候補を探す
- 既存記事との重複や前提を確認する
- 記事に付けるタグを選ぶ
- 同じ話題の記事群を比較する

## tag-index.json の契約

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

## ワークフロー

1. 対象が記事なら、本文ではなくフロントマターの `tags` だけを先に読む。
2. 対象がタグなら、`tag-index.json` から `name` が一致するタグを探す。
3. 同タグの `articles` から候補を作る。
4. 対象記事がある場合は、対象記事自身を候補から除外する。
5. 複数タグがある場合は、複数の対象タグに出る記事を優先する。
6. 同タグ候補が少ない場合、または周辺話題まで求められている場合だけ、`relatedTags` 上位から候補を広げる。
7. 候補を絞った後で、必要な記事本文だけを読む。

## 候補の出し方

- まず同タグ候補を最大5件出す。
- 同タグ候補が多い場合は、次の順で優先する。
  1. 複数の対象タグに出る記事
  2. ユーザーの依頼語または対象記事タイトルと近いタイトルの記事
  3. `articles` の順で新しい記事
- 対象タグ名だけのタイトル一致は、同タグ根拠と重複するため追加の優先理由にしない。
- 関連タグに広げる場合は、`relatedTags` 上位3タグまでを見る。
- 関連タグごとの候補は最大3件に留める。
- 「重複」「前提」「補完」は本文を読む前には仮分類として扱う。
- 本文を読む前に「重複なし」と確定しない。
- 仮分類を確定したい場合だけ、候補記事の本文を読む。

## コマンド例

タグから候補を確認する。

```bash
node -e "const tags=require('./tag-index.json'); console.log(JSON.stringify(tags.find(t=>t.name==='TypeScript'), null, 2));"
```

記事のフロントマターだけを確認する。

```bash
sed -n '1,/^---$/p' _posts/202605021758.md
```

## 出力ルール

- `tag-index.json` 全体を貼らない。
- 候補の根拠になったタグ名を示す。
- `articles` は新しい順、`relatedTags` は関連度順として説明する。
- `tag-index.json` はコミットしないローカル生成物である。初回は `npm install` 後の `postinstall` で生成される。
- `tag-index.json` が存在しない、または古い可能性がある場合は `npm run tags:index` で生成してから読む。
- push時は `npm run tags:export` で `tag-index.json` とタグスニペットを再生成する。
