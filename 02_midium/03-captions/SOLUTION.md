# 模範解答：字幕CSVのアップロードとダウンロード

## ファイル

- [solution.spec.ts](solution.spec.ts)：完成したテスト
- [画面仕様](pages/SCREEN.md)：前提条件・初期表示・期待結果
- [results.config.ts](results.config.ts)
- [pages/ScreenPage.ts](pages/ScreenPage.ts)
- [pages/screen.ts](pages/screen.ts)

## 実行方法

ルートから実行。サーバーは自動起動し、課題別の模範解答と結果設定を使用します。

```sh
npx playwright test --config 02_midium/03-captions/results.config.ts
npx playwright show-report reports/by-exercise/02_midium/03-captions/html
```

Firefoxを使う最後の課題では`npx playwright install firefox`が必要です。`npm test`は学習用テスト、`npm run test:solutions`は全模範解答です。

## 前提条件と実装の考え方

字幕は未選択。教材は字幕CSVを使用し、実際のYouTubeの字幕形式とは別の練習用契約。

fixtureはimport.meta.urlから絶対パスを作ります。ダウンロードの保存先はテスト固有にして並列実行の衝突を防ぎます。

## 検証する内容

1. fixtures/captions.csvを選択し「captions.csv：3行」を検証する。
2. invalid.txtで「字幕CSVを選択してください」を検証する。
3. downloadイベント待機を先に登録し、ファイル名captions.csvを確認する。
4. testInfo.outputPathに保存し、time,textと00:00,こんにちはを確認する。

## テストソース

```ts
import { ScreenPage } from './pages/ScreenPage.js';
import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';

test('CSVと不正ファイルをアップロードする', async ({ page }) => {
  await new ScreenPage(page).goto();
  await new ScreenPage(page).uploadFile(fileURLToPath(new URL('./fixtures/captions.csv', import.meta.url)));
  await expect(page.getByRole('status')).toHaveText('captions.csv：3行');
  await new ScreenPage(page).uploadFile(fileURLToPath(new URL('./fixtures/invalid.txt', import.meta.url)));
  await expect(page.getByRole('status')).toHaveText('字幕CSVを選択してください');
});

test('ダウンロードしたCSVの名前と内容を確認する', async ({ page }, testInfo) => {
  await new ScreenPage(page).goto();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: '字幕をダウンロード' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('captions.csv');
  const output = testInfo.outputPath('captions.csv');
  await download.saveAs(output);
  const csv = await readFile(output, 'utf8');
  expect(csv).toContain('time,text');
  expect(csv).toContain('00:00,こんにちは');
});
```

## 結果の設定

`results.config.ts`は全体設定を継承し、課題別のHTML・JSON・JUnitを`reports/by-exercise/02_midium/03-captions/`へ保存します。失敗時の画像・trace・動画とテスト固有の出力は`test-results/by-exercise/02_midium/03-captions/`です。

全体解答は`reports/solutions/`、学習用は`reports/exercises/`に出力します。同じconfigで再実行すると同じ保存先を更新します。添付はtestInfo.outputPath/attachでテストごとに分離します。

[結果の共通解説](../../RESULTS.md) / [共通設定](../../config/results.ts)

## 公式資料

[Locators](https://playwright.dev/docs/locators) / [Fixtures](https://playwright.dev/docs/test-fixtures) / [Reporters](https://playwright.dev/docs/test-reporters)
