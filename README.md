# YouTubeをテーマにしたPlaywright特訓：15課題

TubeLabというローカルの動画サイトで、低・中・高難易度を各5問練習します。`01_low`、`02_midium`、`03_high`の構成を維持しています。各課題に練習HTML、前提条件と合格条件、`pages/`の画面仕様とPage Object、模範解答ソースとMarkdown、結果設定があります。

実際のYouTubeへアクセスせず、アカウントは不要です。投稿・高評価・チャンネル登録・プレイヤーは教材用のシミュレーションで、外部への投稿やメディアの実再生は行いません。認証・APIもローカル用の簡易実装です。

## 起動

Node.js 20以上。

```sh
npm install
npx playwright install chromium firefox
npm run dev
```

[練習サイトのホーム](http://127.0.0.1:4173/)に全課題へのリンクがあります。

## 課題一覧

| 難易度 | 課題 | 目安 |
| --- | --- | --- |
| 01_low | [チャンネル画面と概要への遷移](01_low/01-channel-navigation/README.md) | 15分 |
| 01_low | [動画の投稿設定](01_low/02-video-upload/README.md) | 20分 |
| 01_low | [コメント投稿の入力検証](01_low/03-comment-validation/README.md) | 25分 |
| 01_low | [後で見るリストの管理](01_low/04-watch-later/README.md) | 25分 |
| 01_low | [動画の高評価とチャンネル登録](01_low/05-video-reactions/README.md) | 30分 |
| 02_midium | [動画検索と読み込み待機](02_midium/01-video-search/README.md) | 35分 |
| 02_midium | [おすすめ動画のAPIモック](02_midium/02-recommendations/README.md) | 40分 |
| 02_midium | [字幕CSVのアップロードとダウンロード](02_midium/03-captions/README.md) | 40分 |
| 02_midium | [埋め込みプレイヤーと共有画面](02_midium/04-player-and-share/README.md) | 45分 |
| 02_midium | [動画サイトの表示テーマと永続化](02_midium/05-appearance/README.md) | 40分 |
| 03_high | [Studioの認証状態と再利用](03_high/01-studio-auth/README.md) | 60分 |
| 03_high | [再生リストのAPI準備と後片付け](03_high/02-playlist-fixtures/README.md) | 70分 |
| 03_high | [ライブ配信のチャット同期](03_high/03-live-chat/README.md) | 75分 |
| 03_high | [検索候補の応答競合](03_high/04-search-race/README.md) | 75分 |
| 03_high | [動画フィードのPage Objectと複数環境](03_high/05-responsive-feed/README.md) | 90分 |

## 練習方法

1. 課題のREADMEで前提条件と合格条件を読む。
2. `pages/SCREEN.md`で画面の初期状態、要素、期待結果を確認する。
3. `exercise.spec.ts`に実装して`test.fixme()`を削除する。
4. 各テストが単独で必要なデータや認証状態を用意できるようにする。
5. レポートの合否・スキップ・添付・失敗時の記録を確認する。
6. `SOLUTION.md`と模範解答のソースで比較する。

```sh
npx playwright test 01_low/01-channel-navigation
npm test
npm run test:ui
npm run test:solutions
npx playwright test --config 03_high/05-responsive-feed/results.config.ts
npx tsc --noEmit
```

初期状態の学習用15テストはスキップされます。スキップは合格ではありません。認証・複数projectは解答のconfigを参考に、exercise.spec.ts用の設定を作成してください。

## 学習する設計

- role・名前・labelを使い、同名のボタンは動画行やregion内へ絞る。座標で識別しない。
- `pages/screen.ts`にURL・要素定義、Page Objectに操作、テストに期待結果をまとめる。
- 前提条件はbeforeEach・fixture・setup・configで準備し、前のテストに依存しない。
- 固定sleepで待たず、expect・通信イベント・Promiseで同期する。
- APIで準備した再生リストはUUIDで分離し、finallyで後片付けする。
- project、ステップ、JSON/画像添付、失敗時のtrace・動画を使って結果を調査する。

## テスト結果

[RESULTS.md](RESULTS.md)に設定と読み方をまとめています。HTML・JSON・JUnitを出力し、失敗時には画像・動画・traceを保存します。

```sh
npm run report
npm run report:solutions
npx playwright show-report reports/by-exercise/01_low/01-channel-navigation/html
```

全体解答は`reports/solutions/`、学習用は`reports/exercises/`、課題別は`reports/by-exercise/`です。自動記録はPlaywright管理のcontextが対象で、自前のcontextは必要に応じて個別設定します。

## 教材の動作確認

`npm run check:training`は全模範解答を実行し、15画面の主要操作・APIを確認します。学習者の解答の自動採点ではありません。動画サイトの教材に合わせ、旧課題のURLも新しいフォルダ名へ変更しています。

## 公式資料

[Locators](https://playwright.dev/docs/locators) / [Fixtures](https://playwright.dev/docs/test-fixtures) / [Authentication](https://playwright.dev/docs/auth) / [Reporters](https://playwright.dev/docs/test-reporters)
