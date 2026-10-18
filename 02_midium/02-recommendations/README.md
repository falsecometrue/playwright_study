# おすすめ動画のAPIモック

YouTubeをテーマにしたローカル教材 / 難易度：中 / 目安：40分

## 学習内容

route.fulfill・HTTPエラー・再試行

## 前提条件

おすすめ一覧は空。読み込みボタンでGET /api/recommendationsが発生する。

## 対象画面

`http://127.0.0.1:4173/02_midium/02-recommendations/`

## 課題・合格条件

1. {videos:[{name:"テスト動画",views:1200}]}を返し「テスト動画：1200回視聴」を検証する。
2. HTTP 500で「おすすめ動画を読み込めませんでした」と動画0件を検証する。
3. 最初は失敗、再試行は成功とし、エラーが消え、通信が2回であること。
4. routeとwaitForResponseはクリック前に登録する。

## pagesと結果設定の観点

Page Objectの操作・通信モック・前提条件を分け、HTML/JSON/JUnitと失敗時の記録を確認する。

[画面仕様](pages/SCREEN.md) / [要素定義](pages/screen.ts) / [結果設定](results.config.ts)

## 作業と実行

`exercise.spec.ts`に実装し、`test.fixme()`を削除します。ルートから実行：

```sh
npx playwright test 02_midium/02-recommendations
```

認証・複数projectを自分の解答で使う場合は、模範解答の`solution.config.ts`を参考に学習用configを作り、`testMatch`を`exercise.spec.ts`へ変更してください。

## ヒント

成功・エラー・回復をそれぞれ確認します。HTTP応答を待つだけで終わらず、画面上の一覧とエラーまで検証します。

## 模範解答

[ソースと解説](SOLUTION.md) / [実行用テスト](solution.spec.ts)
