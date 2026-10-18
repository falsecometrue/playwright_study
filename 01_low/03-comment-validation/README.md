# コメント投稿の入力検証

YouTubeをテーマにしたローカル教材 / 難易度：低 / 目安：25分

## 学習内容

境界値・エラー回復・textarea

## 前提条件

表示名・コメント・結果・エラーは空。コメントはtrim後3〜100文字。

## 対象画面

`http://127.0.0.1:4173/01_low/03-comment-validation/`

## 課題・合格条件

1. 表示名が空の場合「表示名を入力してください」となり、投稿されないこと。
2. コメント2/3/100/101文字の境界を検証する。
3. 空白だけのコメントは3文字未満として拒否されること。
4. 入力を修正して再投稿し、エラーが消え、表示名付きのコメントが表示されること。

## pagesと結果設定の観点

画面仕様の初期状態を確認し、pagesの要素定義から操作する。HTMLレポートで合否とスキップを区別する。

[画面仕様](pages/SCREEN.md) / [要素定義](pages/screen.ts) / [結果設定](results.config.ts)

## 作業と実行

`exercise.spec.ts`に実装し、`test.fixme()`を削除します。ルートから実行：

```sh
npx playwright test 01_low/03-comment-validation
```

認証・複数projectを自分の解答で使う場合は、模範解答の`solution.config.ts`を参考に学習用configを作り、`testMatch`を`exercise.spec.ts`へ変更してください。

## ヒント

文字数の両端を確認します。エラーからの回復は同一テストで、境界値は独立したテストにします。

## 模範解答

[ソースと解説](SOLUTION.md) / [実行用テスト](solution.spec.ts)
