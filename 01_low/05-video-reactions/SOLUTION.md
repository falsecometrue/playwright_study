# 模範解答：動画の高評価とチャンネル登録

## ファイル

- [solution.spec.ts](solution.spec.ts)：完成したテスト
- [画面仕様](pages/SCREEN.md)：前提条件・初期表示・期待結果
- [results.config.ts](results.config.ts)
- [pages/ScreenPage.ts](pages/ScreenPage.ts)
- [pages/screen.ts](pages/screen.ts)

## 実行方法

ルートから実行。サーバーは自動起動し、課題別の模範解答と結果設定を使用します。

```sh
npx playwright test --config 01_low/05-video-reactions/results.config.ts
npx playwright show-report reports/by-exercise/01_low/05-video-reactions/html
```

Firefoxを使う最後の課題では`npx playwright install firefox`が必要です。`npm test`は学習用テスト、`npm run test:solutions`は全模範解答です。

## 前提条件と実装の考え方

高評価100件、未評価、チャンネル未登録。状態はテストごとに初期化する。

複数のstatusを動画アクションとチャンネルのregionで絞ります。登録するとボタン名が変わるため、親region内のボタンを取得します。

## 検証する内容

1. 高評価の初期aria-pressed=falseと100件を検証する。
2. 高評価を押すとtrue/101件、再度押すとfalse/100件となること。
3. チャンネル登録するとボタン名が登録済みになり、押下状態と登録表示を検証する。
4. 再度押すと未登録に戻り、高評価の状態は変わらないこと。

## テストソース

```ts
import { test, expect } from '@playwright/test';
import { ScreenPage } from './pages/ScreenPage.js';

test('高評価を付けて取り消す', async ({ page }) => {
  const video = new ScreenPage(page);
  await video.goto();
  await expect(video.likes).toHaveText('高評価：100件');
  await expect(video.like).toHaveAttribute('aria-pressed', 'false');
  await video.like.click();
  await expect(video.like).toHaveAttribute('aria-pressed', 'true');
  await expect(video.likes).toHaveText('高評価：101件');
  await video.like.click();
  await expect(video.like).toHaveAttribute('aria-pressed', 'false');
  await expect(video.likes).toHaveText('高評価：100件');
});
test('チャンネル登録と解除は高評価に影響しない', async ({ page }) => {
  const video = new ScreenPage(page);
  await video.goto();
  await video.subscriptionButton.click();
  await expect(video.subscriptionButton).toHaveAccessibleName('登録済み');
  await expect(video.subscriptionButton).toHaveAttribute('aria-pressed', 'true');
  await expect(video.subscription).toHaveText('登録しました');
  await video.subscriptionButton.click();
  await expect(video.subscriptionButton).toHaveAccessibleName('チャンネル登録');
  await expect(video.subscription).toHaveText('未登録');
  await expect(video.likes).toHaveText('高評価：100件');
});
```

## 結果の設定

`results.config.ts`は全体設定を継承し、課題別のHTML・JSON・JUnitを`reports/by-exercise/01_low/05-video-reactions/`へ保存します。失敗時の画像・trace・動画とテスト固有の出力は`test-results/by-exercise/01_low/05-video-reactions/`です。

全体解答は`reports/solutions/`、学習用は`reports/exercises/`に出力します。同じconfigで再実行すると同じ保存先を更新します。添付はtestInfo.outputPath/attachでテストごとに分離します。

[結果の共通解説](../../RESULTS.md) / [共通設定](../../config/results.ts)

## 公式資料

[Locators](https://playwright.dev/docs/locators) / [Fixtures](https://playwright.dev/docs/test-fixtures) / [Reporters](https://playwright.dev/docs/test-reporters)
