# 模範解答：検索候補の応答競合

## ファイル

- [solution.spec.ts](solution.spec.ts)：完成したテスト
- [画面仕様](pages/SCREEN.md)：前提条件・初期表示・期待結果
- [results.config.ts](results.config.ts)
- [pages/ScreenPage.ts](pages/ScreenPage.ts)
- [pages/screen.ts](pages/screen.ts)

## 実行方法

ルートから実行。サーバーは自動起動し、課題別の模範解答と結果設定を使用します。

```sh
npx playwright test --config 03_high/04-search-race/results.config.ts
npx playwright show-report reports/by-exercise/03_high/04-search-race/html
```

Firefoxを使う最後の課題では`npx playwright install firefox`が必要です。`npm test`は学習用テスト、`npm run test:solutions`は全模範解答です。

## 前提条件と実装の考え方

入力は空。入力変更ごとに/api/searchを呼び、最新応答だけ描画する。

ネットワーク完了と描画完了は別です。JSON消費後の次タスクで目印を付け、アプリが旧応答を処理し終えた後に一覧を検証します。

## 検証する内容

1. 古い検索語のリクエストを保留してから新しい検索語を入力する。
2. 新しい動画候補を先に返して表示を検証する。
3. その後古い動画候補を返しても新しい候補が維持されること。
4. 旧応答のJSON消費とアプリ継続処理まで待ち、検証が早すぎる見逃しを防ぐ。
5. if(seq!==latest)return;を一時的に外すと失敗することを確認し、必ず元に戻す。

## テストソース

```ts
import { screen } from './pages/screen.js';
import { ScreenPage } from './pages/ScreenPage.js';
import { test, expect } from '@playwright/test';

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>(done => { resolve = done; });
  return { promise, resolve };
}

test('旧応答が遅れても最新の検索結果を維持する', async ({ page }) => {
  // 通信完了だけではアプリ側のjson解析・描画完了を保証できない。
  // JSON消費後の次のタスクで目印を付け、アプリの継続処理を待つ。
  await page.addInitScript(() => {
    const original = Response.prototype.json;
    Response.prototype.json = async function (...args: Parameters<typeof original>) {
      const data = await original.apply(this, args);
      if (data.items?.[0] === '古い動画候補') {
        setTimeout(() => { document.documentElement.dataset.oldResponseProcessed = 'true'; }, 0);
      }
      return data;
    };
  });
  const oldArrived = deferred();
  const releaseOld = deferred();
  await page.route('**/api/search?*', async route => {
    const query = new URL(route.request().url()).searchParams.get('q');
    if (query === '古い検索語') {
      oldArrived.resolve();
      await releaseOld.promise;
      await route.fulfill({ json: { items: ['古い動画候補'] } });
    } else {
      await route.fulfill({ json: { items: ['新しい動画候補'] } });
    }
  });
  await test.step('画面を開く', async () => { await new ScreenPage(page).goto(); });
  try {
    await test.step('古い検索語を送信する', async () => { await new ScreenPage(page).search('古い検索語'); });
    // expect.pollでタイムアウトを持たせ、到着前に次の入力をしない。
    let arrived = false;
    void oldArrived.promise.then(() => { arrived = true; });
    await expect.poll(() => arrived).toBe(true);
    await test.step('新しい検索語を送信する', async () => { await new ScreenPage(page).search('新しい検索語'); });
    await expect(page.getByRole('listitem')).toHaveText(['新しい動画候補']);
    await expect(page.getByRole('status')).toHaveText('1件');
    releaseOld.resolve();
    await expect(page.locator('html')).toHaveAttribute('data-old-response-processed', 'true');
    await expect(page.getByRole('listitem')).toHaveText(['新しい動画候補']);
    await expect(page.getByRole('status')).toHaveText('1件');
  } finally { releaseOld.resolve(); }
});

test.beforeEach(async ({}, testInfo) => {
  await testInfo.attach('画面仕様', {
    body: JSON.stringify(screen, null, 2),
    contentType: 'application/json',
  });
});
```

## 結果の設定

`results.config.ts`は全体設定を継承し、課題別のHTML・JSON・JUnitを`reports/by-exercise/03_high/04-search-race/`へ保存します。失敗時の画像・trace・動画とテスト固有の出力は`test-results/by-exercise/03_high/04-search-race/`です。

全体解答は`reports/solutions/`、学習用は`reports/exercises/`に出力します。同じconfigで再実行すると同じ保存先を更新します。添付はtestInfo.outputPath/attachでテストごとに分離します。

[結果の共通解説](../../RESULTS.md) / [共通設定](../../config/results.ts)

## 公式資料

[Locators](https://playwright.dev/docs/locators) / [Fixtures](https://playwright.dev/docs/test-fixtures) / [Reporters](https://playwright.dev/docs/test-reporters)
