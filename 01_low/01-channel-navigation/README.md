# チャンネル画面と概要への遷移

YouTubeをテーマにしたローカル教材 / 難易度：低 / 目安：15分

## 学習内容

画面遷移・getByRole・URL/タイトルの検証

## 前提条件

チャンネルのホームを開く。ログイン不要。

## 対象画面

`http://127.0.0.1:4173/01_low/01-channel-navigation/`

## 課題・合格条件

1. 初期タイトルと「ホーム」の見出しを検証する。
2. 「チャンネル概要」を押し、view=about、タイトル、概要文「テスト学習チャンネルです」を検証する。
3. goBackでチャンネルホームへ戻ったことを検証する。

## pagesと結果設定の観点

画面仕様の初期状態を確認し、pagesの要素定義から操作する。HTMLレポートで合否とスキップを区別する。

[画面仕様](pages/SCREEN.md) / [要素定義](pages/screen.ts) / [結果設定](results.config.ts)

## 作業と実行

`exercise.spec.ts`に実装し、`test.fixme()`を削除します。ルートから実行：

```sh
npx playwright test 01_low/01-channel-navigation
```

認証・複数projectを自分の解答で使う場合は、模範解答の`solution.config.ts`を参考に学習用configを作り、`testMatch`を`exercise.spec.ts`へ変更してください。

## ヒント

見出し・リンクのroleと名前で識別します。リンクが複数あるため、名前を省略しないでください。

## 模範解答

[ソースと解説](SOLUTION.md) / [実行用テスト](solution.spec.ts)
