import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import base from './solution.config.js';
import { resultSettings } from '../../config/results.js';

export default defineConfig({
  ...base,
  testDir: fileURLToPath(new URL('.', import.meta.url)),
  ...resultSettings('by-exercise/03_high/01-studio-auth'),
});
