import { test as base, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';

type PlaylistItem = { id: string; title: string };
type PlaylistData = { playlist: string; item: PlaylistItem };
export const test = base.extend<{ playlistData: PlaylistData }>({
  playlistData: async ({ request }, use) => {
    const playlist = randomUUID();
    // 作成後の検証で失敗した場合もcleanup対象にする。
    try {
      const response = await request.post('/api/playlist-items', { data: { playlist, title: 'Playwright入門動画' } });
      expect(response.status()).toBe(201);
      const { item } = await response.json() as { item: PlaylistItem };
      await use({ playlist, item });
    } finally {
      const cleanup = await request.delete(`/api/playlist-items?playlist=${encodeURIComponent(playlist)}`);
      expect(cleanup.status()).toBe(204);
    }
  },
});
export { expect } from '@playwright/test';
