# 模範解答：埋め込みプレイヤーと共有画面

## ファイル

- [solution.spec.ts](solution.spec.ts)：完成したテスト
- [画面仕様](pages/SCREEN.md)：前提条件・初期表示・期待結果
- [results.config.ts](results.config.ts)
- [pages/ScreenPage.ts](pages/ScreenPage.ts)
- [pages/screen.ts](pages/screen.ts)

## 実行方法

ルートから実行。サーバーは自動起動し、課題別の模範解答と結果設定を使用します。

```sh
npx playwright test --config 02_midium/04-player-and-share/results.config.ts
npx playwright show-report reports/by-exercise/02_midium/04-player-and-share/html
```

Firefoxを使う最後の課題では`npx playwright install firefox`が必要です。`npm test`は学習用テスト、`npm run test:solutions`は全模範解答です。

## 前提条件と実装の考え方

履歴は未削除。iframeの再生位置は0秒で、再生は停止状態。実メディアを使わない状態シミュレーション。

親ページ・iframe・別タブは操作対象が違います。Page ObjectでframeLocatorを保持し、popupのPageは検証後に閉じます。

## 検証する内容

1. 共有画面を別タブで取得し、見出し「動画を共有」と動画URLを検証する。
2. iframe内で再生位置30秒へ移動し、結果を検証する。
3. 再生ボタンを押し、一時停止ボタンのaria-pressed=trueを検証する。
4. 視聴履歴削除confirmのキャンセルと承認を別テストで検証する。
5. イベント待機とハンドラーをクリック前に登録する。

## テストソース

```ts
import { ScreenPage } from './pages/ScreenPage.js';
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => { await new ScreenPage(page).goto(); });

test('別タブの動画を共有を確認する', async ({ page }) => {
  const popupPromise = page.waitForEvent('popup');
  await page.getByRole('link', { name: '共有画面を開く' }).click();
  const receipt = await popupPromise;
  try {
    await expect(receipt.getByRole('heading', { name: '動画を共有', exact: true })).toBeVisible();
    await expect(receipt.getByText('動画URL：/watch?v=demo', { exact: true })).toBeVisible();
  } finally { await receipt.close(); }
});

test('iframe内で再生位置（秒）を保存する', async ({ page }) => {
  const screenPage = new ScreenPage(page);
  await screenPage.seekTo('30');
  const frame = screenPage.playerFrame;
  await expect(frame.getByRole('status')).toHaveText('再生位置：30秒');
  await frame.getByRole('button', { name: '再生', exact: true }).click();
  await expect(frame.getByRole('button', { name: '一時停止', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

for (const accept of [false, true]) {
  test(`削除確認を${accept ? '承認' : 'キャンセル'}する`, async ({ page }) => {
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toBe('視聴履歴を削除しますか？');
      if (accept) await dialog.accept(); else await dialog.dismiss();
    });
    await page.getByRole('button', { name: '視聴履歴を削除' }).click();
    await expect(page.getByRole('status')).toHaveText(accept ? '削除しました' : 'キャンセルしました');
  });
}
```

## 結果の設定

`results.config.ts`は全体設定を継承し、課題別のHTML・JSON・JUnitを`reports/by-exercise/02_midium/04-player-and-share/`へ保存します。失敗時の画像・trace・動画とテスト固有の出力は`test-results/by-exercise/02_midium/04-player-and-share/`です。

全体解答は`reports/solutions/`、学習用は`reports/exercises/`に出力します。同じconfigで再実行すると同じ保存先を更新します。添付はtestInfo.outputPath/attachでテストごとに分離します。

[結果の共通解説](../../RESULTS.md) / [共通設定](../../config/results.ts)

## 公式資料

[Locators](https://playwright.dev/docs/locators) / [Fixtures](https://playwright.dev/docs/test-fixtures) / [Reporters](https://playwright.dev/docs/test-reporters)
