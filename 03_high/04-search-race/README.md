# 検索候補の応答競合

YouTubeをテーマにしたローカル教材 / 難易度：高 / 目安：75分

## 学習内容

応答順の制御・不具合の検出

## 前提条件

入力は空。入力変更ごとに/api/searchを呼び、最新応答だけ描画する。

## 対象画面

`http://127.0.0.1:4173/03_high/04-search-race/`

## 課題・合格条件

1. 古い検索語のリクエストを保留してから新しい検索語を入力する。
2. 新しい動画候補を先に返して表示を検証する。
3. その後古い動画候補を返しても新しい候補が維持されること。
4. 旧応答のJSON消費とアプリ継続処理まで待ち、検証が早すぎる見逃しを防ぐ。
5. if(seq!==latest)return;を一時的に外すと失敗することを確認し、必ず元に戻す。

## pagesと結果設定の観点

fixture/setupによる前提条件の準備、データ分離、test.step、仕様添付、projectごとの結果を確認する。

[画面仕様](pages/SCREEN.md) / [要素定義](pages/screen.ts) / [結果設定](results.config.ts)

## 作業と実行

`exercise.spec.ts`に実装し、`test.fixme()`を削除します。ルートから実行：

```sh
npx playwright test 03_high/04-search-race
```

認証・複数projectを自分の解答で使う場合は、模範解答の`solution.config.ts`を参考に学習用configを作り、`testMatch`を`exercise.spec.ts`へ変更してください。

## ヒント

ネットワーク完了と描画完了は別です。JSON消費後の次タスクで目印を付け、アプリが旧応答を処理し終えた後に一覧を検証します。

## 模範解答

[ソースと解説](SOLUTION.md) / [実行用テスト](solution.spec.ts)
