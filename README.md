# nishiryo / zenn-content

Zennの記事とその画像アセットを1つのgitリポジトリで管理する。studio(`~/career/studio/`)から書き出される。

## ディレクトリ構成

```
zenn-content/
├── articles/<slug>.md          # 記事本体(frontmatter + Markdown)。<slug>=studio draft.idハイフン除去(32桁hex)
├── images/<slug>/<filename>    # 記事ごとの画像アセット
├── scripts/add-image.mjs       # 画像追加ヘルパー
└── books/                      # (未使用)
```

## 記事内での画像参照

このリポジトリはPublicなので、raw.githubusercontent.com経由で画像URLに直接アクセスできる。記事内では以下のURLパターンで参照する:

```
https://raw.githubusercontent.com/nishiryo23/zenn-content/main/images/<slug>/<filename>
```

Markdownの書き方:

```markdown
![alt text](https://raw.githubusercontent.com/nishiryo23/zenn-content/main/images/<slug>/foo.svg)
*caption(斜体でZennがキャプションとして扱う)*
```

## 画像を追加する

`scripts/add-image.mjs` を使う:

```bash
node scripts/add-image.mjs <slug> <画像パス> [alt] [caption]
# 例:
node scripts/add-image.mjs 5b056ee1e5554097bbf2992dbd309a45 ~/Downloads/foo.svg "図1" "3モデル比較"
```

やること:
1. `images/<slug>/<画像名>` へコピー(既存はエラー、上書きは `--force`)
2. Markdown断片を標準出力に印字(そのままエディタに貼れる形)

貼った後、studio側のdraft本文にも同じ行を入れておくと、再書き出しで消えない。

## 公開フロー

1. studio → 「Zennへ書き出し」 → `articles/<slug>.md` が更新される
2. 必要なら画像を `images/<slug>/` に追加(上記スクリプト)
3. `articles/<slug>.md` の frontmatter を `published: true` にする
4. `git add . && git commit -m "..." && git push`
5. Zenn連携が自動デプロイ

初回連携時のみ、Zennダッシュボードの「リポジトリ設定 → 手動デプロイ」で連携前のcommitを取り込む必要がある。

## 参考

- [Zenn CLI ガイド](https://zenn.dev/zenn/articles/zenn-cli-guide)
