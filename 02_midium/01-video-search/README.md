# 動画検索と読み込み待機

YouTubeをテーマにしたローカル教材 / 難易度：中 / 目安：35分

## 学習内容

非同期・auto-wait・通信の保留

## 前提条件

入力・検索結果は空、検索ボタンは有効。/api/searchは遅延応答する。

## 対象画面

`http://127.0.0.1:4173/02_midium/01-video-search/`

## 課題・合格条件

1. Playwrightを検索し、検索中とボタン無効を検証する。
2. Playwright入門動画・Playwright実践動画の2件とボタン有効を検証する。
3. 該当なしの検索で0件になること。
4. waitForTimeoutを使わずに実装する。

## pagesと結果設定の観点

Page Objectの操作・通信モック・前提条件を分け、HTML/JSON/JUnitと失敗時の記録を確認する。

[画面仕様](pages/SCREEN.md) / [要素定義](pages/screen.ts) / [結果設定](results.config.ts)

## 作業と実行

`exercise.spec.ts`に実装し、`test.fixme()`を削除します。ルートから実行：

```sh
npx playwright test 02_midium/01-video-search
```

認証・複数projectを自分の解答で使う場合は、模範解答の`solution.config.ts`を参考に学習用configを作り、`testMatch`を`exercise.spec.ts`へ変更してください。

## ヒント

route.fetchで実APIを呼び、応答の解放だけPromiseで制御します。短い検索中状態を確実に検証した後、結果の描画をexpectで待ちます。

## 模範解答

[ソースと解説](SOLUTION.md) / [実行用テスト](solution.spec.ts)
