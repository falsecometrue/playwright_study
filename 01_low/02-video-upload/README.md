# 動画の投稿設定

YouTubeをテーマにしたローカル教材 / 難易度：低 / 目安：20分

## 学習内容

fill・selectOption・check・必須項目

## 前提条件

動画タイトルは空、公開設定は非公開、著作権確認は未チェック。メタデータの練習で実動画はアップロードしない。

## 対象画面

`http://127.0.0.1:4173/01_low/02-video-upload/`

## 課題・合格条件

1. 動画タイトル「Playwright入門動画」、公開設定「限定公開」、著作権確認ありで保存する。
2. 結果「Playwright入門動画：限定公開で保存しました」を検証する。
3. 著作権を確認していない場合は保存結果が空で、requiredの検証に失敗することを別テストで確認する。

## pagesと結果設定の観点

画面仕様の初期状態を確認し、pagesの要素定義から操作する。HTMLレポートで合否とスキップを区別する。

[画面仕様](pages/SCREEN.md) / [要素定義](pages/screen.ts) / [結果設定](results.config.ts)

## 作業と実行

`exercise.spec.ts`に実装し、`test.fixme()`を削除します。ルートから実行：

```sh
npx playwright test 01_low/02-video-upload
```

認証・複数projectを自分の解答で使う場合は、模範解答の`solution.config.ts`を参考に学習用configを作り、`testMatch`を`exercise.spec.ts`へ変更してください。

## ヒント

投稿フォームの設定と検証を扱います。前提条件はbeforeEachで準備し、成功と未確認のテストを独立させます。

## 模範解答

[ソースと解説](SOLUTION.md) / [実行用テスト](solution.spec.ts)
