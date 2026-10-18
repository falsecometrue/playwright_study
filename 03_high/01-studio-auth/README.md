# Studioの認証状態と再利用

YouTubeをテーマにしたローカル教材 / 難易度：高 / 目安：60分

## 学習内容

setup project・storageState・認証

## 前提条件

user@example.com / training123。未認証の/api/meは401、認証済みは200。教材用cookie認証。

## 対象画面

`http://127.0.0.1:4173/03_high/01-studio-auth/`

## 課題・合格条件

1. setupでログインし、playwright/.auth/user.jsonへ保存する。
2. projectのdependenciesとstorageStateでログイン操作なしにYouTube風Studioを表示する。
3. ログアウトでStudioが消え、APIが401になること。
4. 匿名の別contextでも401を検証する。
5. 認証ファイルをGit対象から除外し、各テストへ画面仕様を添付する。

## pagesと結果設定の観点

fixture/setupによる前提条件の準備、データ分離、test.step、仕様添付、projectごとの結果を確認する。

[画面仕様](pages/SCREEN.md) / [要素定義](pages/screen.ts) / [結果設定](results.config.ts)

## 作業と実行

`exercise.spec.ts`に実装し、`test.fixme()`を削除します。ルートから実行：

```sh
npx playwright test 03_high/01-studio-auth
```

認証・複数projectを自分の解答で使う場合は、模範解答の`solution.config.ts`を参考に学習用configを作り、`testMatch`を`exercise.spec.ts`へ変更してください。

## ヒント

setupで初期認証を作り、各テストは保存状態から独立したcontextを用意します。Page ObjectのsignInをsetupから再利用します。

## 模範解答

[ソースと解説](SOLUTION.md) / [実行用テスト](solution.spec.ts)
