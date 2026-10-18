import { test as base } from '@playwright/test';
import { VideoFeedPage } from './pages/VideoFeedPage.js';

export const test = base.extend<{ feed: VideoFeedPage }>({
  feed: async ({ page }, use) => { await use(new VideoFeedPage(page)); },
});
export { expect } from '@playwright/test';
