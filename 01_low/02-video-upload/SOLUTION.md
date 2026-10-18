# 模範解答：動画の投稿設定

## ファイル

- [solution.spec.ts](solution.spec.ts)：完成したテスト
- [画面仕様](pages/SCREEN.md)：前提条件・初期表示・期待結果
- [results.config.ts](results.config.ts)
- [pages/ScreenPage.ts](pages/ScreenPage.ts)
- [pages/screen.ts](pages/screen.ts)

## 実行方法

ルートから実行。サーバーは自動起動し、課題別の模範解答と結果設定を使用します。

```sh
npx playwright test --config 01_low/02-video-upload/results.config.ts
npx playwright show-report reports/by-exercise/01_low/02-video-upload/html
```

Firefoxを使う最後の課題では`npx playwright install firefox`が必要です。`npm test`は学習用テスト、`npm run test:solutions`は全模範解答です。

## 前提条件と実装の考え方

動画タイトルは空、公開設定は非公開、著作権確認は未チェック。メタデータの練習で実動画はアップロードしない。

投稿フォームの設定と検証を扱います。前提条件はbeforeEachで準備し、成功と未確認のテストを独立させます。

## 検証する内容

1. 動画タイトル「Playwright入門動画」、公開設定「限定公開」、著作権確認ありで保存する。
2. 結果「Playwright入門動画：限定公開で保存しました」を検証する。
3. 著作権を確認していない場合は保存結果が空で、requiredの検証に失敗することを別テストで確認する。

## テストソース

```ts
import { test, expect } from '@playwright/test';
import { ScreenPage } from './pages/ScreenPage.js';

test.beforeEach(async ({ page }) => {
  const upload = new ScreenPage(page);
  await upload.goto();
  await upload.titleInput.fill('Playwright入門動画');
  await upload.visibility.selectOption('限定公開');
});
test('動画の投稿設定を保存する', async ({ page }) => {
  const upload = new ScreenPage(page);
  await upload.rights.check();
  await upload.save.click();
  await expect(upload.result).toHaveText('Playwright入門動画：限定公開で保存しました');
});
test('著作権の確認前は保存できない', async ({ page }) => {
  const upload = new ScreenPage(page);
  await expect(upload.rights).not.toBeChecked();
  await upload.save.click();
  await expect(upload.result).toBeEmpty();
  expect(await upload.rights.evaluate(element => (element as HTMLInputElement).validity.valueMissing)).toBe(true);
});
```

## 結果の設定

`results.config.ts`は全体設定を継承し、課題別のHTML・JSON・JUnitを`reports/by-exercise/01_low/02-video-upload/`へ保存します。失敗時の画像・trace・動画とテスト固有の出力は`test-results/by-exercise/01_low/02-video-upload/`です。

全体解答は`reports/solutions/`、学習用は`reports/exercises/`に出力します。同じconfigで再実行すると同じ保存先を更新します。添付はtestInfo.outputPath/attachでテストごとに分離します。

[結果の共通解説](../../RESULTS.md) / [共通設定](../../config/results.ts)

## 公式資料

[Locators](https://playwright.dev/docs/locators) / [Fixtures](https://playwright.dev/docs/test-fixtures) / [Reporters](https://playwright.dev/docs/test-reporters)
