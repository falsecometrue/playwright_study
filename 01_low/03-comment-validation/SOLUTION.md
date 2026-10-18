# 模範解答：コメント投稿の入力検証

## ファイル

- [solution.spec.ts](solution.spec.ts)：完成したテスト
- [画面仕様](pages/SCREEN.md)：前提条件・初期表示・期待結果
- [results.config.ts](results.config.ts)
- [pages/ScreenPage.ts](pages/ScreenPage.ts)
- [pages/screen.ts](pages/screen.ts)

## 実行方法

ルートから実行。サーバーは自動起動し、課題別の模範解答と結果設定を使用します。

```sh
npx playwright test --config 01_low/03-comment-validation/results.config.ts
npx playwright show-report reports/by-exercise/01_low/03-comment-validation/html
```

Firefoxを使う最後の課題では`npx playwright install firefox`が必要です。`npm test`は学習用テスト、`npm run test:solutions`は全模範解答です。

## 前提条件と実装の考え方

表示名・コメント・結果・エラーは空。コメントはtrim後3〜100文字。

文字数の両端を確認します。エラーからの回復は同一テストで、境界値は独立したテストにします。

## 検証する内容

1. 表示名が空の場合「表示名を入力してください」となり、投稿されないこと。
2. コメント2/3/100/101文字の境界を検証する。
3. 空白だけのコメントは3文字未満として拒否されること。
4. 入力を修正して再投稿し、エラーが消え、表示名付きのコメントが表示されること。

## テストソース

```ts
import { test, expect } from '@playwright/test';
import { ScreenPage } from './pages/ScreenPage.js';

test.beforeEach(async ({ page }) => { await new ScreenPage(page).goto(); });
test('表示名が空なら投稿できない', async ({ page }) => {
  const comments = new ScreenPage(page);
  await comments.comment.fill('参考になりました');
  await comments.submit.click();
  await expect(comments.error).toHaveText('表示名を入力してください');
  await expect(comments.result).toBeEmpty();
});
for (const length of [2, 3, 100, 101]) {
  test(`コメント${length}文字の境界値`, async ({ page }) => {
    const comments = new ScreenPage(page);
    await comments.author.fill('Alice');
    await comments.comment.fill('あ'.repeat(length));
    await comments.submit.click();
    const error = length < 3 ? 'コメントは3文字以上です' : length > 100 ? 'コメントは100文字以内です' : '';
    await expect(comments.error).toHaveText(error);
    await expect(comments.result).toHaveText(error ? '' : 'Alice：' + 'あ'.repeat(length));
  });
}
test('修正するとエラーが消える', async ({ page }) => {
  const comments = new ScreenPage(page);
  await comments.author.fill('Alice');
  await comments.comment.fill('  ');
  await comments.submit.click();
  await expect(comments.error).toHaveText('コメントは3文字以上です');
  await comments.comment.fill('わかりやすいです');
  await comments.submit.click();
  await expect(comments.error).toBeEmpty();
  await expect(comments.result).toHaveText('Alice：わかりやすいです');
});
```

## 結果の設定

`results.config.ts`は全体設定を継承し、課題別のHTML・JSON・JUnitを`reports/by-exercise/01_low/03-comment-validation/`へ保存します。失敗時の画像・trace・動画とテスト固有の出力は`test-results/by-exercise/01_low/03-comment-validation/`です。

全体解答は`reports/solutions/`、学習用は`reports/exercises/`に出力します。同じconfigで再実行すると同じ保存先を更新します。添付はtestInfo.outputPath/attachでテストごとに分離します。

[結果の共通解説](../../RESULTS.md) / [共通設定](../../config/results.ts)

## 公式資料

[Locators](https://playwright.dev/docs/locators) / [Fixtures](https://playwright.dev/docs/test-fixtures) / [Reporters](https://playwright.dev/docs/test-reporters)
