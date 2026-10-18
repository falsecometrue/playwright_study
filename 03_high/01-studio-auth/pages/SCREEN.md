# 画面仕様：Studioの認証状態と再利用

## URLとタイトル

- URL：`/03_high/01-studio-auth/`
- document.titleとh1：`Studioの認証状態と再利用`（概要などへの遷移後は別タイトル）
- 共通ヘッダー：TubeLab。ローカルの学習用動画サイト。

## 前提条件・初期状態

user@example.com / training123。未認証の/api/meは401、認証済みは200。教材用cookie認証。

## 要素の識別

| プロパティ | 役割またはラベル | 検索する名前 |
| --- | --- | --- |
| `email` | label | メール |
| `password` | label | パスワード |
| `login` | button | ログイン |
| `account` | heading | YouTube風Studio |
| `logout` | button | ログアウト |
| `error` | alert | 名前指定なし |

同じ役割・名前が複数ある場合は動画の行、region、iframeで絞ります。getByRoleは座標を使って識別しません。

## 操作・状態遷移・期待結果

1. setupでログインし、playwright/.auth/user.jsonへ保存する。
2. projectのdependenciesとstorageStateでログイン操作なしにYouTube風Studioを表示する。
3. ログアウトでStudioが消え、APIが401になること。
4. 匿名の別contextでも401を検証する。
5. 認証ファイルをGit対象から除外し、各テストへ画面仕様を添付する。

## 実装

[定数と要素定義](screen.ts) / [Page Object](ScreenPage.ts)

`screen.ts`はテスト側の定義で、HTMLを自動変更する設定ではありません。仕様変更時は画面HTML・この文書・Page Object・期待結果を合わせて見直します。
