import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { resultSettings } from './config/results.js';

const root = fileURLToPath(new URL('.', import.meta.url));
export default defineConfig({
  testDir: root,
  testMatch: '**/exercise.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  ...resultSettings('exercises'),
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure', screenshot: 'only-on-failure', video: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node scripts/server.mjs',
    cwd: root,
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
});
