import { defineConfig, devices } from '@playwright/test';
import base from './playwright.config.js';
import { resultSettings } from './config/results.js';
import { authFile } from './03_high/01-studio-auth/auth-path.js';

export default defineConfig({
  ...base,
  ...resultSettings('solutions'),
  testMatch: '**/solution.spec.ts',
  projects: [
    {
      name: 'solutions-chromium',
      testIgnore: ['**/03_high/01-studio-auth/**', '**/03_high/05-responsive-feed/**'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'auth-setup',
      testMatch: '**/03_high/01-studio-auth/auth.setup.ts',
      use: { ...devices['Desktop Chrome'], storageState: { cookies: [], origins: [] } },
    },
    {
      name: 'authenticated',
      testMatch: '**/03_high/01-studio-auth/solution.spec.ts',
      dependencies: ['auth-setup'],
      use: { ...devices['Desktop Chrome'], storageState: authFile },
    },
    ...[
      { name: 'feed-desktop-chromium', device: 'Desktop Chrome' },
      { name: 'feed-desktop-firefox', device: 'Desktop Firefox' },
      { name: 'feed-mobile-chromium', device: 'Pixel 7' },
    ].map(({ name, device }) => ({
      name,
      testMatch: '**/03_high/05-responsive-feed/solution.spec.ts',
      use: { ...devices[device] },
    })),
  ],
});
