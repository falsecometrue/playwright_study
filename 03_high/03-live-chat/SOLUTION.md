# 模範解答：ライブ配信のチャット同期

## ファイル

- [solution.spec.ts](solution.spec.ts)：完成したテスト
- [画面仕様](pages/SCREEN.md)：前提条件・初期表示・期待結果
- [results.config.ts](results.config.ts)
- [pages/ScreenPage.ts](pages/ScreenPage.ts)
- [pages/screen.ts](pages/screen.ts)

## 実行方法

ルートから実行。サーバーは自動起動し、課題別の模範解答と結果設定を使用します。

```sh
npx playwright test --config 03_high/03-live-chat/results.config.ts
npx playwright show-report reports/by-exercise/03_high/03-live-chat/html
```

Firefoxを使う最後の課題では`npx playwright install firefox`が必要です。`npm test`は学習用テスト、`npm run test:solutions`は全模範解答です。

## 前提条件と実装の考え方

AliceとBobは同じUUID配信、Carolは別UUID配信。250msポーリングで同期する。

別配信が空であるだけでは参加失敗を区別できません。Carol自身の投稿が見えることを確認し、機能している別配信への漏えいがないと検証します。

## 検証する内容

1. 独立した3つのcontextで2配信に参加する。
2. Aliceのこんにちは、Bobの了解が双方に1回ずつ同じ順序で表示されること。
3. Carolの投稿は別配信にのみ表示されること。
4. APIでも配信ごとの投稿を検証する。
5. finallyで全contextを閉じ、配信データを削除する。

## テストソース

```ts
import { screen } from './pages/screen.js';
import { ScreenPage } from './pages/ScreenPage.js';
import { test, expect, type BrowserContext, type Page } from '@playwright/test';
import { randomUUID } from 'node:crypto';

async function join(page: Page, room: string, user: string) {
  await test.step('画面を開く', async () => { await new ScreenPage(page).goto(); });
  await new ScreenPage(page).joinRoom(room, user);
}
async function send(page: Page, text: string) {
  await test.step(`メッセージ送信：${text}`, async () => {
    await new ScreenPage(page).sendMessage(text);
  });
}

test('別context同士で同期し、別配信IDには漏れない', async ({ browser, baseURL, request }) => {
  const room = randomUUID();
  const isolatedRoom = randomUUID();
  const contexts: BrowserContext[] = [];
  try {
    // 自前で作ったcontextはPlaywrightのpage fixtureと異なり、自分でcloseする。
    for (let i = 0; i < 3; i++) contexts.push(await browser.newContext({ baseURL }));
    const [alice, bob, outsider] = await Promise.all(contexts.map(context => context.newPage()));
    await Promise.all([join(alice, room, 'Alice'), join(bob, room, 'Bob'), join(outsider, isolatedRoom, 'Carol')]);
    await send(alice, 'こんにちは');
    await expect(bob.getByRole('listitem')).toHaveText(['Alice：こんにちは']);
    await send(bob, '了解');
    const expected = ['Alice：こんにちは', 'Bob：了解'];
    await expect(alice.getByRole('listitem')).toHaveText(expected);
    await expect(bob.getByRole('listitem')).toHaveText(expected);

    // Carol自身の投稿が見えれば、参加・ポーリングが動いた状態を確認できる。
    await send(outsider, '別配信IDです');
    await expect(outsider.getByRole('listitem')).toHaveText(['Carol：別配信IDです']);
    await expect.poll(async () => {
      const response = await request.get(`/api/messages?room=${room}`);
      expect(response.status()).toBe(200);
      return (await response.json()).messages;
    }).toEqual([{ user: 'Alice', text: 'こんにちは' }, { user: 'Bob', text: '了解' }]);
    const isolated = await request.get(`/api/messages?room=${isolatedRoom}`);
    expect((await isolated.json()).messages).toEqual([{ user: 'Carol', text: '別配信IDです' }]);
  } finally {
    // 全contextのcloseを試し、その成否にかかわらず配信IDも削除する。
    const closed = await Promise.allSettled(contexts.map(context => context.close()));
    const deleted = await Promise.all([room, isolatedRoom].map(id => request.delete(`/api/messages?room=${id}`)));
    for (const response of deleted) expect(response.status()).toBe(204);
    for (const result of closed) if (result.status === 'rejected') throw result.reason;
  }
});

test.beforeEach(async ({}, testInfo) => {
  await testInfo.attach('画面仕様', {
    body: JSON.stringify(screen, null, 2),
    contentType: 'application/json',
  });
});
```

## 結果の設定

`results.config.ts`は全体設定を継承し、課題別のHTML・JSON・JUnitを`reports/by-exercise/03_high/03-live-chat/`へ保存します。失敗時の画像・trace・動画とテスト固有の出力は`test-results/by-exercise/03_high/03-live-chat/`です。

全体解答は`reports/solutions/`、学習用は`reports/exercises/`に出力します。同じconfigで再実行すると同じ保存先を更新します。添付はtestInfo.outputPath/attachでテストごとに分離します。

[結果の共通解説](../../RESULTS.md) / [共通設定](../../config/results.ts)

## API契約

- `GET /api/messages?room=...` → `{messages:[{user,text}]}`
- `POST /api/messages`：`{room,user,text}` → 201 `{message:{user,text}}`
- `DELETE /api/messages?room=...` → 204
- APIのroomは画面の配信IDに対応。

## 公式資料

[Locators](https://playwright.dev/docs/locators) / [Fixtures](https://playwright.dev/docs/test-fixtures) / [Reporters](https://playwright.dev/docs/test-reporters)
