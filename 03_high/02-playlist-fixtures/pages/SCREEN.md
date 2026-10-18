# 画面仕様：再生リストのAPI準備と後片付け

## URLとタイトル

- URL：`/03_high/02-playlist-fixtures/`
- document.titleとh1：`再生リストのAPI準備と後片付け`（概要などへの遷移後は別タイトル）
- 共通ヘッダー：TubeLab。ローカルの学習用動画サイト。

## 前提条件・初期状態

テストごとにUUIDのplaylistを作る。サーバーはメモリ保存で再起動時に消える。

## 要素の識別

| プロパティ | 役割またはラベル | 検索する名前 |
| --- | --- | --- |
| `playlist` | label | 再生リストID |
| `load` | button | 読み込む |
| `rows` | listitem | 名前指定なし |

同じ役割・名前が複数ある場合は動画の行、region、iframeで絞ります。getByRoleは座標を使って識別しません。

## 操作・状態遷移・期待結果

1. fixtureでPOST /api/playlist-itemsに{playlist,title}を送り、動画を作成する。
2. UIに再生リストIDを設定して読み込み、作成した動画を検証する。
3. UI削除後、GET APIでもitems=[]であること。
4. finallyでそのplaylistの残存動画をDELETEし、失敗時も後片付けする。
5. 2テストを並列実行し、互いの動画を削除しない。

## 実装

[定数と要素定義](screen.ts) / [Page Object](ScreenPage.ts)

`screen.ts`はテスト側の定義で、HTMLを自動変更する設定ではありません。仕様変更時は画面HTML・この文書・Page Object・期待結果を合わせて見直します。
