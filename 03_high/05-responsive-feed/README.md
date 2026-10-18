# 動画フィードのPage Objectと複数環境

YouTubeをテーマにしたローカル教材 / 難易度：高 / 目安：90分

## 学習内容

Page Object・fixture・projects・添付

## 前提条件

全動画3件、後で見る0件。幅600px以下ではカテゴリを隠しメニューを表示する。

## 対象画面

`http://127.0.0.1:4173/03_high/05-responsive-feed/`

## 課題・合格条件

1. VideoFeedPageをfixtureで注入し、初期一覧とレイアウトを検証する。
2. 学習カテゴリで2件、Playwright入門動画を後で見るへ追加し1件を検証する。
3. desktop Chromium / desktop Firefox / mobile Chromiumで同じテストを実行する。
4. モバイルではメニューを開く処理をPage Objectにまとめる。
5. test.stepで操作・検証を区切り、仕様JSONと画面画像をレポートに添付する。

## pagesと結果設定の観点

fixture/setupによる前提条件の準備、データ分離、test.step、仕様添付、projectごとの結果を確認する。

[画面仕様](pages/SCREEN.md) / [要素定義](pages/screen.ts) / [結果設定](results.config.ts)

## 作業と実行

`exercise.spec.ts`に実装し、`test.fixme()`を削除します。ルートから実行：

```sh
npx playwright test 03_high/05-responsive-feed
```

認証・複数projectを自分の解答で使う場合は、模範解答の`solution.config.ts`を参考に学習用configを作り、`testMatch`を`exercise.spec.ts`へ変更してください。

## ヒント

roleと名前は要素を識別するために使います。初期レイアウトの可視性は別の検証です。画面分岐はPage Objectへ集め、テスト本文を共通化します。

## 模範解答

[ソースと解説](SOLUTION.md) / [実行用テスト](solution.spec.ts)
