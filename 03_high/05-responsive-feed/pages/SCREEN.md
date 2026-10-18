# 画面仕様：動画フィードのPage Objectと複数環境

## URLとタイトル

- URL：`/03_high/05-responsive-feed/`
- document.titleとh1：`動画フィードのPage Objectと複数環境`（概要などへの遷移後は別タイトル）
- 共通ヘッダー：TubeLab。ローカルの学習用動画サイト。

## 前提条件・初期状態

全動画3件、後で見る0件。幅600px以下ではカテゴリを隠しメニューを表示する。

## 要素の識別

| プロパティ | 役割またはラベル | 検索する名前 |
| --- | --- | --- |
| `navigation` | navigation | 動画カテゴリ |
| `menu` | button | メニュー |
| `videos` | listitem | 名前指定なし |
| `watchLater` | status | 名前指定なし |

同じ役割・名前が複数ある場合は動画の行、region、iframeで絞ります。getByRoleは座標を使って識別しません。

## 操作・状態遷移・期待結果

1. VideoFeedPageをfixtureで注入し、初期一覧とレイアウトを検証する。
2. 学習カテゴリで2件、Playwright入門動画を後で見るへ追加し1件を検証する。
3. desktop Chromium / desktop Firefox / mobile Chromiumで同じテストを実行する。
4. モバイルではメニューを開く処理をPage Objectにまとめる。
5. test.stepで操作・検証を区切り、仕様JSONと画面画像をレポートに添付する。

## 実装

[定数と要素定義](screen.ts) / [Page Object](VideoFeedPage.ts)

`screen.ts`はテスト側の定義で、HTMLを自動変更する設定ではありません。仕様変更時は画面HTML・この文書・Page Object・期待結果を合わせて見直します。
