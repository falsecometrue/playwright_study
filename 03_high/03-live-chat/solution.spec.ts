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
