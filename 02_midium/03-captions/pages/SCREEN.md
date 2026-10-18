# 画面仕様：字幕CSVのアップロードとダウンロード

## URLとタイトル

- URL：`/02_midium/03-captions/`
- document.titleとh1：`字幕CSVのアップロードとダウンロード`（概要などへの遷移後は別タイトル）
- 共通ヘッダー：TubeLab。ローカルの学習用動画サイト。

## 前提条件・初期状態

字幕は未選択。教材は字幕CSVを使用し、実際のYouTubeの字幕形式とは別の練習用契約。

## 要素の識別

| プロパティ | 役割またはラベル | 検索する名前 |
| --- | --- | --- |
| `upload` | label | 字幕CSV |
| `download` | link | 字幕をダウンロード |
| `result` | status | 名前指定なし |

同じ役割・名前が複数ある場合は動画の行、region、iframeで絞ります。getByRoleは座標を使って識別しません。

## 操作・状態遷移・期待結果

1. fixtures/captions.csvを選択し「captions.csv：3行」を検証する。
2. invalid.txtで「字幕CSVを選択してください」を検証する。
3. downloadイベント待機を先に登録し、ファイル名captions.csvを確認する。
4. testInfo.outputPathに保存し、time,textと00:00,こんにちはを確認する。

## 実装

[定数と要素定義](screen.ts) / [Page Object](ScreenPage.ts)

`screen.ts`はテスト側の定義で、HTMLを自動変更する設定ではありません。仕様変更時は画面HTML・この文書・Page Object・期待結果を合わせて見直します。
