# 模範解答：チャンネル画面と概要への遷移

## ファイル

- [solution.spec.ts](solution.spec.ts)：完成したテスト
- [画面仕様](pages/SCREEN.md)：前提条件・初期表示・期待結果
- [results.config.ts](results.config.ts)
- [pages/ScreenPage.ts](pages/ScreenPage.ts)
- [pages/screen.ts](pages/screen.ts)

## 実行方法

ルートから実行。サーバーは自動起動し、課題別の模範解答と結果設定を使用します。

```sh
npx playwright test --config 01_low/01-channel-navigation/results.config.ts
npx playwright show-report reports/by-exercise/01_low/01-channel-navigation/html
```

Firefoxを使う最後の課題では`npx playwright install firefox`が必要です。`npm test`は学習用テスト、`npm run test:solutions`は全模範解答です。

## 前提条件と実装の考え方

チャンネルのホームを開く。ログイン不要。

見出し・リンクのroleと名前で識別します。リンクが複数あるため、名前を省略しないでください。

## 検証する内容

1. 初期タイトルと「ホーム」の見出しを検証する。
2. 「チャンネル概要」を押し、view=about、タイトル、概要文「テスト学習チャンネルです」を検証する。
3. goBackでチャンネルホームへ戻ったことを検証する。

## テストソース

```ts
import { ScreenPage } from './pages/ScreenPage.js';
import { test, expect } from '@playwright/test';

test('ホームから説明ページへ遷移して戻る', async ({ page }) => {
  await new ScreenPage(page).goto();
  await expect(page).toHaveTitle('チャンネル画面と概要への遷移');
  await expect(page.getByRole('heading', { name: 'ホーム', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'チャンネル概要' }).click();
  await expect(page).toHaveURL(/\?view=about$/);
  await expect(page).toHaveTitle('チャンネル概要');
  await expect(page.getByRole('heading', { name: 'チャンネル概要', exact: true })).toBeVisible();
  await expect(page.getByText('テスト学習チャンネルです', { exact: true })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/01_low\/01-channel-navigation\/$/);
  await expect(page.getByRole('heading', { name: 'ホーム', exact: true })).toBeVisible();
});
```

## 結果の設定

`results.config.ts`は全体設定を継承し、課題別のHTML・JSON・JUnitを`reports/by-exercise/01_low/01-channel-navigation/`へ保存します。失敗時の画像・trace・動画とテスト固有の出力は`test-results/by-exercise/01_low/01-channel-navigation/`です。

全体解答は`reports/solutions/`、学習用は`reports/exercises/`に出力します。同じconfigで再実行すると同じ保存先を更新します。添付はtestInfo.outputPath/attachでテストごとに分離します。

[結果の共通解説](../../RESULTS.md) / [共通設定](../../config/results.ts)

## 公式資料

[Locators](https://playwright.dev/docs/locators) / [Fixtures](https://playwright.dev/docs/test-fixtures) / [Reporters](https://playwright.dev/docs/test-reporters)
