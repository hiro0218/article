#!/bin/bash
# _posts に tag-index.json / article-index.json より新しい記事があれば、
# セッション開始時に「索引が古い可能性がある」事実をコンテキストへ知らせる。
# 実際の再生成や、モード(読み取り専用/保存あり)に応じた対応は
# .claude/skills/article-writer/references/article-repository.md 側の
# ルールに委ね、このフックは事実の検知だけを行う。
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
[ -d _posts ] || exit 0

missing=""
for idx in tag-index.json article-index.json; do
  [ -f "$idx" ] || missing="$missing $idx"
done

if [ -n "$missing" ]; then
  echo "[article-index freshness]$missing が見つかりません。対応は article-repository.md の索引の扱いルールに従ってください。"
  exit 0
fi

newer_post=$(find _posts -name '*.md' \( -newer tag-index.json -o -newer article-index.json \) 2>/dev/null | head -1)

if [ -n "$newer_post" ]; then
  echo "[article-index freshness] tag-index.json / article-index.json が _posts の内容より古い可能性があります(例: $newer_post が新しい)。対応は article-repository.md の索引の扱いルールに従ってください。"
fi

exit 0
