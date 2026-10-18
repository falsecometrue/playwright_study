# 画面仕様：動画検索と読み込み待機

## URLとタイトル

- URL：`/02_midium/01-video-search/`
- document.titleとh1：`動画検索と読み込み待機`（概要などへの遷移後は別タイトル）
- 共通ヘッダー：TubeLab。ローカルの学習用動画サイト。

## 前提条件・初期状態

入力・検索結果は空、検索ボタンは有効。/api/searchは遅延応答する。

## 要素の識別

| プロパティ | 役割またはラベル | 検索する名前 |
| --- | --- | --- |
| `query` | label | 動画を検索 |
| `searchButton` | button | 検索 |
| `status` | status | 名前指定なし |
| `rows` | listitem | 名前指定なし |

同じ役割・名前が複数ある場合は動画の行、region、iframeで絞ります。getByRoleは座標を使って識別しません。

## 操作・状態遷移・期待結果

1. Playwrightを検索し、検索中とボタン無効を検証する。
2. Playwright入門動画・Playwright実践動画の2件とボタン有効を検証する。
3. 該当なしの検索で0件になること。
4. waitForTimeoutを使わずに実装する。

## 実装

[定数と要素定義](screen.ts) / [Page Object](ScreenPage.ts)

`screen.ts`はテスト側の定義で、HTMLを自動変更する設定ではありません。仕様変更時は画面HTML・この文書・Page Object・期待結果を合わせて見直します。
