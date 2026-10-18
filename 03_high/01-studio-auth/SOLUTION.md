# 模範解答：Studioの認証状態と再利用

## ファイル

- [solution.spec.ts](solution.spec.ts)：完成したテスト
- [画面仕様](pages/SCREEN.md)：前提条件・初期表示・期待結果
- [auth-path.ts](auth-path.ts)
- [auth.setup.ts](auth.setup.ts)
- [results.config.ts](results.config.ts)
- [solution.config.ts](solution.config.ts)
- [pages/ScreenPage.ts](pages/ScreenPage.ts)
- [pages/screen.ts](pages/screen.ts)

## 実行方法

ルートから実行。サーバーは自動起動し、課題別の模範解答と結果設定を使用します。

```sh
npx playwright test --config 03_high/01-studio-auth/results.config.ts
npx playwright show-report reports/by-exercise/03_high/01-studio-auth/html
```

Firefoxを使う最後の課題では`npx playwright install firefox`が必要です。`npm test`は学習用テスト、`npm run test:solutions`は全模範解答です。

## 前提条件と実装の考え方

user@example.com / training123。未認証の/api/meは401、認証済みは200。教材用cookie認証。

setupで初期認証を作り、各テストは保存状態から独立したcontextを用意します。Page ObjectのsignInをsetupから再利用します。

## 検証する内容

1. setupでログインし、playwright/.auth/user.jsonへ保存する。
2. projectのdependenciesとstorageStateでログイン操作なしにYouTube風Studioを表示する。
3. ログアウトでStudioが消え、APIが401になること。
4. 匿名の別contextでも401を検証する。
5. 認証ファイルをGit対象から除外し、各テストへ画面仕様を添付する。

## テストソース

```ts
import { screen } from './pages/screen.js';
import { ScreenPage } from './pages/ScreenPage.js';
import { test, expect } from '@playwright/test';

test('保存した状態でログイン操作なしにYouTube風Studioを表示する', async ({ page }) => {
  await test.step('画面を開く', async () => { await new ScreenPage(page).goto(); });
  await expect(page.getByRole('heading', { name: 'YouTube風Studio', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'ログイン', exact: true })).toBeHidden();
});

test('ログアウトすると認証が失われる', async ({ page, context }) => {
  await test.step('画面を開く', async () => { await new ScreenPage(page).goto(); });
  await expect(page.getByRole('heading', { name: 'YouTube風Studio', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'ログアウト', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'YouTube風Studio', exact: true })).toBeHidden();
  await expect(page.getByRole('button', { name: 'ログイン', exact: true })).toBeVisible();
  expect((await context.request.get('/api/me')).status()).toBe(401);
});

test('認証なしの別contextではAPIが401を返す', async ({ browser, baseURL }) => {
  const anonymous = await browser.newContext({ baseURL, storageState: { cookies: [], origins: [] } });
  try {
    const response = await anonymous.request.get('/api/me');
    expect(response.status()).toBe(401);
  } finally { await anonymous.close(); }
});

test.beforeEach(async ({}, testInfo) => {
  await testInfo.attach('画面仕様', {
    body: JSON.stringify(screen, null, 2),
    contentType: 'application/json',
  });
});
```

## 結果の設定

`results.config.ts`は全体設定を継承し、課題別のHTML・JSON・JUnitを`reports/by-exercise/03_high/01-studio-auth/`へ保存します。失敗時の画像・trace・動画とテスト固有の出力は`test-results/by-exercise/03_high/01-studio-auth/`です。

全体解答は`reports/solutions/`、学習用は`reports/exercises/`に出力します。同じconfigで再実行すると同じ保存先を更新します。添付はtestInfo.outputPath/attachでテストごとに分離します。

[結果の共通解説](../../RESULTS.md) / [共通設定](../../config/results.ts)

## 公式資料

[Locators](https://playwright.dev/docs/locators) / [Fixtures](https://playwright.dev/docs/test-fixtures) / [Reporters](https://playwright.dev/docs/test-reporters)
