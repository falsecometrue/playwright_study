# 画面仕様：動画サイトの表示テーマと永続化

## URLとタイトル

- URL：`/02_midium/05-appearance/`
- document.titleとh1：`動画サイトの表示テーマと永続化`（概要などへの遷移後は別タイトル）
- 共通ヘッダー：TubeLab。ローカルの学習用動画サイト。

## 前提条件・初期状態

localStorageなしではライト。theme=darkが保存されていればダーク。

## 要素の識別

| プロパティ | 役割またはラベル | 検索する名前 |
| --- | --- | --- |
| `theme` | label | 表示テーマ |
| `result` | status | 名前指定なし |

同じ役割・名前が複数ある場合は動画の行、region、iframeで絞ります。getByRoleは座標を使って識別しません。

## 操作・状態遷移・期待結果

1. ライトの初期表示とbodyのdata-theme=lightを検証する。
2. ダークに変更後リロードし、表示文とdata-themeが保持されること。
3. addInitScriptでtheme=darkを設定し、初回からダークであること。
4. 別テストではライトとlocalStorage未設定を確認し、実行順に依存させない。

## 実装

[定数と要素定義](screen.ts) / [Page Object](ScreenPage.ts)

`screen.ts`はテスト側の定義で、HTMLを自動変更する設定ではありません。仕様変更時は画面HTML・この文書・Page Object・期待結果を合わせて見直します。
