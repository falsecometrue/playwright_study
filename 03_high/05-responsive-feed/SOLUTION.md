# 模範解答：動画フィードのPage Objectと複数環境

## ファイル

- [solution.spec.ts](solution.spec.ts)：完成したテスト
- [画面仕様](pages/SCREEN.md)：前提条件・初期表示・期待結果
- [video-feed.fixture.ts](video-feed.fixture.ts)
- [video-feed.page.ts](video-feed.page.ts)
- [results.config.ts](results.config.ts)
- [solution.config.ts](solution.config.ts)
- [pages/VideoFeedPage.ts](pages/VideoFeedPage.ts)
- [pages/screen.ts](pages/screen.ts)

## 実行方法

ルートから実行。サーバーは自動起動し、課題別の模範解答と結果設定を使用します。

```sh
npx playwright test --config 03_high/05-responsive-feed/results.config.ts
npx playwright show-report reports/by-exercise/03_high/05-responsive-feed/html
```

Firefoxを使う最後の課題では`npx playwright install firefox`が必要です。`npm test`は学習用テスト、`npm run test:solutions`は全模範解答です。

## 前提条件と実装の考え方

全動画3件、後で見る0件。幅600px以下ではカテゴリを隠しメニューを表示する。

roleと名前は要素を識別するために使います。初期レイアウトの可視性は別の検証です。画面分岐はPage Objectへ集め、テスト本文を共通化します。

## 検証する内容

1. VideoFeedPageをfixtureで注入し、初期一覧とレイアウトを検証する。
2. 学習カテゴリで2件、Playwright入門動画を後で見るへ追加し1件を検証する。
3. desktop Chromium / desktop Firefox / mobile Chromiumで同じテストを実行する。
4. モバイルではメニューを開く処理をPage Objectにまとめる。
5. test.stepで操作・検証を区切り、仕様JSONと画面画像をレポートに添付する。

## テストソース

```ts
import { screen } from './pages/screen.js';
import { test, expect } from './video-feed.fixture.js';

test('学習を絞り込んで動画を後で見るに追加する', async ({ feed, page }, testInfo) => {
  await test.step('初期画面を確認する', async () => {
    await feed.goto();
    await expect(page).toHaveTitle(screen.title);
    await expect(feed.videos).toHaveCount(3);
    await expect(feed.watchLater).toHaveText('後で見る：0件');
    await feed.expectInitialLayout();
  });
  await test.step('学習カテゴリを選択する', async () => {
    await feed.selectCategory('学習');
    await expect(feed.videos).toHaveCount(2);
    await expect(feed.videos).toHaveText(['Playwright入門動画追加', 'テスト設計動画追加']);
  });
  await test.step('動画を追加して結果を記録する', async () => {
    await feed.saveVideo('Playwright入門動画');
    await expect(feed.watchLater).toHaveText('後で見る：1件');
    await testInfo.attach('後で見るの表示', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });
});

test.beforeEach(async ({}, testInfo) => {
  await testInfo.attach('画面仕様', {
    body: JSON.stringify(screen, null, 2),
    contentType: 'application/json',
  });
});
```

## 結果の設定

`results.config.ts`は全体設定を継承し、課題別のHTML・JSON・JUnitを`reports/by-exercise/03_high/05-responsive-feed/`へ保存します。失敗時の画像・trace・動画とテスト固有の出力は`test-results/by-exercise/03_high/05-responsive-feed/`です。

全体解答は`reports/solutions/`、学習用は`reports/exercises/`に出力します。同じconfigで再実行すると同じ保存先を更新します。添付はtestInfo.outputPath/attachでテストごとに分離します。

[結果の共通解説](../../RESULTS.md) / [共通設定](../../config/results.ts)

## 公式資料

[Locators](https://playwright.dev/docs/locators) / [Fixtures](https://playwright.dev/docs/test-fixtures) / [Reporters](https://playwright.dev/docs/test-reporters)
