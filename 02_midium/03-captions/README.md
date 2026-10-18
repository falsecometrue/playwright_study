# 字幕CSVのアップロードとダウンロード

YouTubeをテーマにしたローカル教材 / 難易度：中 / 目安：40分

## 学習内容

setInputFiles・download・outputPath

## 前提条件

字幕は未選択。教材は字幕CSVを使用し、実際のYouTubeの字幕形式とは別の練習用契約。

## 対象画面

`http://127.0.0.1:4173/02_midium/03-captions/`

## 課題・合格条件

1. fixtures/captions.csvを選択し「captions.csv：3行」を検証する。
2. invalid.txtで「字幕CSVを選択してください」を検証する。
3. downloadイベント待機を先に登録し、ファイル名captions.csvを確認する。
4. testInfo.outputPathに保存し、time,textと00:00,こんにちはを確認する。

## pagesと結果設定の観点

Page Objectの操作・通信モック・前提条件を分け、HTML/JSON/JUnitと失敗時の記録を確認する。

[画面仕様](pages/SCREEN.md) / [要素定義](pages/screen.ts) / [結果設定](results.config.ts)

## 作業と実行

`exercise.spec.ts`に実装し、`test.fixme()`を削除します。ルートから実行：

```sh
npx playwright test 02_midium/03-captions
```

認証・複数projectを自分の解答で使う場合は、模範解答の`solution.config.ts`を参考に学習用configを作り、`testMatch`を`exercise.spec.ts`へ変更してください。

## ヒント

fixtureはimport.meta.urlから絶対パスを作ります。ダウンロードの保存先はテスト固有にして並列実行の衝突を防ぎます。

## 模範解答

[ソースと解説](SOLUTION.md) / [実行用テスト](solution.spec.ts)
