# 模範解答：後で見るリストの管理

## ファイル

- [solution.spec.ts](solution.spec.ts)：完成したテスト
- [画面仕様](pages/SCREEN.md)：前提条件・初期表示・期待結果
- [results.config.ts](results.config.ts)
- [pages/ScreenPage.ts](pages/ScreenPage.ts)
- [pages/screen.ts](pages/screen.ts)

## 実行方法

ルートから実行。サーバーは自動起動し、課題別の模範解答と結果設定を使用します。

```sh
npx playwright test --config 01_low/04-watch-later/results.config.ts
npx playwright show-report reports/by-exercise/01_low/04-watch-later/html
```

Firefoxを使う最後の課題では`npx playwright install firefox`が必要です。`npm test`は学習用テスト、`npm run test:solutions`は全模範解答です。

## 前提条件と実装の考え方

後で見るリストは空。各動画に視聴済みチェックと削除ボタンがある。

filter({has: ...})で動画の行を絞ってから、その行の削除ボタンを操作します。画面上の座標や何番目かに依存させません。

## 検証する内容

1. 「JavaScript入門」「Playwright入門」「テスト設計」を追加し3件を検証する。
2. Playwright入門の行だけ視聴済みにし、他2件は未視聴であること。
3. JavaScript入門の行内の削除を押し、残り2件と内容・順序を検証する。
4. 空白だけのタイトルは追加されないこと。

## テストソース

```ts
import { ScreenPage } from './pages/ScreenPage.js';
import { test, expect } from '@playwright/test';

test('追加・特定行の視聴済み・削除と空白入力', async ({ page }) => {
  await new ScreenPage(page).goto();
  for (const title of ['JavaScript入門', 'Playwright入門', 'テスト設計']) {
    await page.getByLabel('動画タイトル').fill(title);
    await page.getByRole('button', { name: '追加', exact: true }).click();
  }
  const rows = page.getByRole('listitem');
  await expect(rows).toHaveCount(3);
  const study = rows.filter({ has: page.getByLabel('Playwright入門', { exact: true }) });
  await study.getByRole('checkbox').check();
  await expect(study.getByRole('checkbox')).toBeChecked();
  await expect(page.getByLabel('JavaScript入門', { exact: true })).not.toBeChecked();
  await expect(page.getByLabel('テスト設計', { exact: true })).not.toBeChecked();
  await rows.filter({ has: page.getByLabel('JavaScript入門', { exact: true }) }).getByRole('button', { name: '削除' }).click();
  await expect(rows).toHaveCount(2);
  await expect(rows).toHaveText(['Playwright入門削除', 'テスト設計削除']);
  await page.getByLabel('動画タイトル').fill('   ');
  await page.getByRole('button', { name: '追加', exact: true }).click();
  await expect(rows).toHaveCount(2);
});
```

## 結果の設定

`results.config.ts`は全体設定を継承し、課題別のHTML・JSON・JUnitを`reports/by-exercise/01_low/04-watch-later/`へ保存します。失敗時の画像・trace・動画とテスト固有の出力は`test-results/by-exercise/01_low/04-watch-later/`です。

全体解答は`reports/solutions/`、学習用は`reports/exercises/`に出力します。同じconfigで再実行すると同じ保存先を更新します。添付はtestInfo.outputPath/attachでテストごとに分離します。

[結果の共通解説](../../RESULTS.md) / [共通設定](../../config/results.ts)

## 公式資料

[Locators](https://playwright.dev/docs/locators) / [Fixtures](https://playwright.dev/docs/test-fixtures) / [Reporters](https://playwright.dev/docs/test-reporters)
