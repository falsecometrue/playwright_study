# 埋め込みプレイヤーと共有画面

YouTubeをテーマにしたローカル教材 / 難易度：中 / 目安：45分

## 学習内容

popup・frameLocator・dialog

## 前提条件

履歴は未削除。iframeの再生位置は0秒で、再生は停止状態。実メディアを使わない状態シミュレーション。

## 対象画面

`http://127.0.0.1:4173/02_midium/04-player-and-share/`

## 課題・合格条件

1. 共有画面を別タブで取得し、見出し「動画を共有」と動画URLを検証する。
2. iframe内で再生位置30秒へ移動し、結果を検証する。
3. 再生ボタンを押し、一時停止ボタンのaria-pressed=trueを検証する。
4. 視聴履歴削除confirmのキャンセルと承認を別テストで検証する。
5. イベント待機とハンドラーをクリック前に登録する。

## pagesと結果設定の観点

Page Objectの操作・通信モック・前提条件を分け、HTML/JSON/JUnitと失敗時の記録を確認する。

[画面仕様](pages/SCREEN.md) / [要素定義](pages/screen.ts) / [結果設定](results.config.ts)

## 作業と実行

`exercise.spec.ts`に実装し、`test.fixme()`を削除します。ルートから実行：

```sh
npx playwright test 02_midium/04-player-and-share
```

認証・複数projectを自分の解答で使う場合は、模範解答の`solution.config.ts`を参考に学習用configを作り、`testMatch`を`exercise.spec.ts`へ変更してください。

## ヒント

親ページ・iframe・別タブは操作対象が違います。Page ObjectでframeLocatorを保持し、popupのPageは検証後に閉じます。

## 模範解答

[ソースと解説](SOLUTION.md) / [実行用テスト](solution.spec.ts)
