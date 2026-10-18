# 動画の高評価とチャンネル登録

YouTubeをテーマにしたローカル教材 / 難易度：低 / 目安：30分

## 学習内容

regionのスコープ・aria-pressed・状態遷移

## 前提条件

高評価100件、未評価、チャンネル未登録。状態はテストごとに初期化する。

## 対象画面

`http://127.0.0.1:4173/01_low/05-video-reactions/`

## 課題・合格条件

1. 高評価の初期aria-pressed=falseと100件を検証する。
2. 高評価を押すとtrue/101件、再度押すとfalse/100件となること。
3. チャンネル登録するとボタン名が登録済みになり、押下状態と登録表示を検証する。
4. 再度押すと未登録に戻り、高評価の状態は変わらないこと。

## pagesと結果設定の観点

画面仕様の初期状態を確認し、pagesの要素定義から操作する。HTMLレポートで合否とスキップを区別する。

[画面仕様](pages/SCREEN.md) / [要素定義](pages/screen.ts) / [結果設定](results.config.ts)

## 作業と実行

`exercise.spec.ts`に実装し、`test.fixme()`を削除します。ルートから実行：

```sh
npx playwright test 01_low/05-video-reactions
```

認証・複数projectを自分の解答で使う場合は、模範解答の`solution.config.ts`を参考に学習用configを作り、`testMatch`を`exercise.spec.ts`へ変更してください。

## ヒント

複数のstatusを動画アクションとチャンネルのregionで絞ります。登録するとボタン名が変わるため、親region内のボタンを取得します。

## 模範解答

[ソースと解説](SOLUTION.md) / [実行用テスト](solution.spec.ts)
