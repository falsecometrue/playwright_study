import { ScreenPage } from './pages/ScreenPage.js';
import { test as setup, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { authFile } from './auth-path.js';

setup('ログイン済みの状態を保存する', async ({ page }) => {
  await new ScreenPage(page).goto();
  await new ScreenPage(page).signIn('user@example.com', 'training123');
  await expect(page.getByRole('heading', { name: 'YouTube風Studio', exact: true })).toBeVisible();
  await mkdir(dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
});
