# 画面仕様：おすすめ動画のAPIモック

## URLとタイトル

- URL：`/02_midium/02-recommendations/`
- document.titleとh1：`おすすめ動画のAPIモック`（概要などへの遷移後は別タイトル）
- 共通ヘッダー：TubeLab。ローカルの学習用動画サイト。

## 前提条件・初期状態

おすすめ一覧は空。読み込みボタンでGET /api/recommendationsが発生する。

## 要素の識別

| プロパティ | 役割またはラベル | 検索する名前 |
| --- | --- | --- |
| `load` | button | おすすめ動画を読み込む |
| `rows` | listitem | 名前指定なし |
| `error` | alert | 名前指定なし |

同じ役割・名前が複数ある場合は動画の行、region、iframeで絞ります。getByRoleは座標を使って識別しません。

## 操作・状態遷移・期待結果

1. {videos:[{name:"テスト動画",views:1200}]}を返し「テスト動画：1200回視聴」を検証する。
2. HTTP 500で「おすすめ動画を読み込めませんでした」と動画0件を検証する。
3. 最初は失敗、再試行は成功とし、エラーが消え、通信が2回であること。
4. routeとwaitForResponseはクリック前に登録する。

## 実装

[定数と要素定義](screen.ts) / [Page Object](ScreenPage.ts)

`screen.ts`はテスト側の定義で、HTMLを自動変更する設定ではありません。仕様変更時は画面HTML・この文書・Page Object・期待結果を合わせて見直します。
