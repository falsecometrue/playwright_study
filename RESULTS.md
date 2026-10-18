# テスト結果の設定と確認

## 設定の責務

- 各課題の`pages/SCREEN.md`：初期状態・要素・操作後の期待結果。
- `pages/screen.ts`：テストで使うURL・タイトル・要素名。
- `pages/ScreenPage.ts`または`pages/VideoFeedPage.ts`：ロケーターと画面操作。
- `exercise.spec.ts` / `solution.spec.ts`：条件、操作の組み合わせ、期待結果の検証。
- `playwright.config.ts` / `solutions.config.ts`：対象テスト、実行環境、失敗時の記録。
- `config/results.ts`：出力先とreporter。各課題の`results.config.ts`はこれを継承する。

画面仕様の定義はアプリのHTMLを自動変更しません。HTMLの仕様を変更するときは、文書・Page Object・期待結果を合わせて見直します。

## 実行と保存先

```sh
npm test
npm run report
npm run test:solutions
npm run report:solutions
npx playwright test --config 02_midium/03-captions/results.config.ts
npx playwright show-report reports/by-exercise/02_midium/03-captions/html
```

| 実行種別 | レポート | 添付・失敗時の記録 |
| --- | --- | --- |
| 練習用 | `reports/exercises/` | `test-results/exercises/` |
| 模範解答全体 | `reports/solutions/` | `test-results/solutions/` |
| 課題別の模範解答 | `reports/by-exercise/<難易度>/<課題>/` | `test-results/by-exercise/<難易度>/<課題>/` |

レポートの配下には`html/`、`results.json`、`junit.xml`が生成されます。HTMLとテストの`outputDir`は別ディレクトリにします。同じconfigを再実行すると同じ保存先を更新するため、履歴が必要なら実行後に保存先をコピーするか、実行IDを含むscopeを指定します。別ジョブを並行実行する場合にもscopeを分けます。

`results.config.ts`は完成した模範解答を実行する設定です。練習用の結果設定はルート`playwright.config.ts`が同じ共通設定を使っています。高難易度の認証と複数projectは、それぞれ必要な専用configを継承します。

## reporterと記録の違い

| 設定 | 動作 | 確認するもの |
| --- | --- | --- |
| `list` | ターミナルへ一覧を表示 | どのテストが実行されたか |
| `html` | ブラウザ用レポートを作成 | エラー、step、添付、project |
| `json` | 機械処理用JSONを作成 | suite、spec、test、試行ごとのresult |
| `junit` | CI向けXMLを作成 | 成功・失敗・スキップ |
| `screenshot: 'only-on-failure'` | 失敗時に画像を保存 | 失敗時の画面 |
| `trace: 'retain-on-failure'` | traceを記録し、成功時は削除 | 操作、DOM、通信の経過 |
| `video: 'retain-on-failure'` | 動画を記録し、成功時は削除 | 画面の変化 |

`retain-on-failure`は成功するまで何も記録しないという意味ではありません。実行中は記録し、成功した試行のファイルは残さない設定です。

CLIの`--reporter`はconfigのreporterを上書きします。HTML・JSON・JUnitをまとめて生成したい場合は指定しません。記録は自動管理のpage/contextが中心です。複数ユーザーの課題で自分で`browser.newContext()`したcontextは、動画が必要なら`recordVideo`、traceが必要なら`context.tracing`を別途設定・保存する必要があります。

## 結果の読み方

- passed：アサーションを含むテストが成功した。
- failed：試行が失敗した。HTMLから期待値・実値・失敗したstepを確認する。
- skipped：未実装、条件による除外、または`test.fixme()`。合格ではない。
- flaky：最初は失敗し、再試行で成功した。安定した合格として見過ごさない。

ローカルでは再試行0、CIでは1回を既存設定どおり使います。失敗の再現には`--retries=0`を使います。JSONの各testの`results`を確認すると各試行の状態を追えます。

失敗記録の確認は、練習中に期待値を一時的に間違えた状態で1テストだけ実行し、スクリーンショット・動画・traceが保存されたことを確認してから元に戻すと練習できます。

```sh
npx playwright show-trace test-results/<scope>/<テストの出力フォルダ>/trace.zip
```

## ステップと添付の例

高難易度の模範解答では画面仕様をJSONで添付します。最後の課題では、画面準備・操作・検証をstepに分け、後で見るの画面も添付します。

```ts
await test.step('学習カテゴリを選択する', async () => {
  await feed.selectCategory('学習');
});
await testInfo.attach('画面仕様', {
  body: JSON.stringify(screen, null, 2),
  contentType: 'application/json',
});
```

ファイルの保存には`testInfo.outputPath('ファイル名')`を使います。固定パスに直接書くと並列テストで衝突します。自動記録と明示的なattachは別の機能なので、明示的な添付は成功時にもレポートに残ります。

## 公式資料

[Page Object](https://playwright.dev/docs/pom)、[Reporters](https://playwright.dev/docs/test-reporters)、[記録の設定](https://playwright.dev/docs/test-use-options#recording-options)、[添付](https://playwright.dev/docs/api/class-testinfo#test-info-attach)。
