# 後で見るリストの管理

YouTubeをテーマにしたローカル教材 / 難易度：低 / 目安：25分

## 学習内容

一覧・行の絞り込み・checkbox

## 前提条件

後で見るリストは空。各動画に視聴済みチェックと削除ボタンがある。

## 対象画面

`http://127.0.0.1:4173/01_low/04-watch-later/`

## 課題・合格条件

1. 「JavaScript入門」「Playwright入門」「テスト設計」を追加し3件を検証する。
2. Playwright入門の行だけ視聴済みにし、他2件は未視聴であること。
3. JavaScript入門の行内の削除を押し、残り2件と内容・順序を検証する。
4. 空白だけのタイトルは追加されないこと。

## pagesと結果設定の観点

画面仕様の初期状態を確認し、pagesの要素定義から操作する。HTMLレポートで合否とスキップを区別する。

[画面仕様](pages/SCREEN.md) / [要素定義](pages/screen.ts) / [結果設定](results.config.ts)

## 作業と実行

`exercise.spec.ts`に実装し、`test.fixme()`を削除します。ルートから実行：

```sh
npx playwright test 01_low/04-watch-later
```

認証・複数projectを自分の解答で使う場合は、模範解答の`solution.config.ts`を参考に学習用configを作り、`testMatch`を`exercise.spec.ts`へ変更してください。

## ヒント

filter({has: ...})で動画の行を絞ってから、その行の削除ボタンを操作します。画面上の座標や何番目かに依存させません。

## 模範解答

[ソースと解説](SOLUTION.md) / [実行用テスト](solution.spec.ts)
