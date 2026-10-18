# 模範解答：動画サイトの表示テーマと永続化

## ファイル

- [solution.spec.ts](solution.spec.ts)：完成したテスト
- [画面仕様](pages/SCREEN.md)：前提条件・初期表示・期待結果
- [results.config.ts](results.config.ts)
- [pages/ScreenPage.ts](pages/ScreenPage.ts)
- [pages/screen.ts](pages/screen.ts)

## 実行方法

ルートから実行。サーバーは自動起動し、課題別の模範解答と結果設定を使用します。

```sh
npx playwright test --config 02_midium/05-appearance/results.config.ts
npx playwright show-report reports/by-exercise/02_midium/05-appearance/html
```

Firefoxを使う最後の課題では`npx playwright install firefox`が必要です。`npm test`は学習用テスト、`npm run test:solutions`は全模範解答です。

## 前提条件と実装の考え方

localStorageなしではライト。theme=darkが保存されていればダーク。

テーマの永続化は同一context内で確認し、テスト間は新しいcontextで分離します。select内の選択肢を含むラベルは部分一致で取得します。

## 検証する内容

1. ライトの初期表示とbodyのdata-theme=lightを検証する。
2. ダークに変更後リロードし、表示文とdata-themeが保持されること。
3. addInitScriptでtheme=darkを設定し、初回からダークであること。
4. 別テストではライトとlocalStorage未設定を確認し、実行順に依存させない。

## テストソース

```ts
import { ScreenPage } from './pages/ScreenPage.js';
import { test, expect } from '@playwright/test';

test('ダークテーマはリロード後も保持される', async ({ page }) => {
  await new ScreenPage(page).goto();
  await expect(page.getByRole('status')).toHaveText('現在のテーマ：ライト');
  await expect(page.locator('body')).toHaveAttribute('data-theme', 'light');
  await new ScreenPage(page).selectTheme('dark');
  await page.reload();
  await expect(page.getByRole('status')).toHaveText('現在のテーマ：ダーク');
  await expect(page.locator('body')).toHaveAttribute('data-theme', 'dark');
});

test('ページの初期化前にlocalStorageを設定する', async ({ page }) => {
  await page.addInitScript(() => { localStorage.setItem('theme', 'dark'); });
  await new ScreenPage(page).goto();
  await expect(page.getByRole('status')).toHaveText('現在のテーマ：ダーク');
  await expect(page.locator('body')).toHaveAttribute('data-theme', 'dark');
});

test('独立したテストの初期状態はライト', async ({ page }) => {
  // テストごとに新しいcontextが用意されるため、実行順に関係なくライト。
  await new ScreenPage(page).goto();
  await expect(page.getByRole('status')).toHaveText('現在のテーマ：ライト');
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBeNull();
});
```

## 結果の設定

`results.config.ts`は全体設定を継承し、課題別のHTML・JSON・JUnitを`reports/by-exercise/02_midium/05-appearance/`へ保存します。失敗時の画像・trace・動画とテスト固有の出力は`test-results/by-exercise/02_midium/05-appearance/`です。

全体解答は`reports/solutions/`、学習用は`reports/exercises/`に出力します。同じconfigで再実行すると同じ保存先を更新します。添付はtestInfo.outputPath/attachでテストごとに分離します。

[結果の共通解説](../../RESULTS.md) / [共通設定](../../config/results.ts)

## 公式資料

[Locators](https://playwright.dev/docs/locators) / [Fixtures](https://playwright.dev/docs/test-fixtures) / [Reporters](https://playwright.dev/docs/test-reporters)
