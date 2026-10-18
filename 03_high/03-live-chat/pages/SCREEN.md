# 画面仕様：ライブ配信のチャット同期

## URLとタイトル

- URL：`/03_high/03-live-chat/`
- document.titleとh1：`ライブ配信のチャット同期`（概要などへの遷移後は別タイトル）
- 共通ヘッダー：TubeLab。ローカルの学習用動画サイト。

## 前提条件・初期状態

AliceとBobは同じUUID配信、Carolは別UUID配信。250msポーリングで同期する。

## 要素の識別

| プロパティ | 役割またはラベル | 検索する名前 |
| --- | --- | --- |
| `room` | label | 配信ID |
| `user` | label | ユーザー名 |
| `join` | button | 参加 |
| `message` | label | メッセージ |
| `send` | button | 送信 |
| `rows` | listitem | 名前指定なし |

同じ役割・名前が複数ある場合は動画の行、region、iframeで絞ります。getByRoleは座標を使って識別しません。

## 操作・状態遷移・期待結果

1. 独立した3つのcontextで2配信に参加する。
2. Aliceのこんにちは、Bobの了解が双方に1回ずつ同じ順序で表示されること。
3. Carolの投稿は別配信にのみ表示されること。
4. APIでも配信ごとの投稿を検証する。
5. finallyで全contextを閉じ、配信データを削除する。

## 実装

[定数と要素定義](screen.ts) / [Page Object](ScreenPage.ts)

`screen.ts`はテスト側の定義で、HTMLを自動変更する設定ではありません。仕様変更時は画面HTML・この文書・Page Object・期待結果を合わせて見直します。
