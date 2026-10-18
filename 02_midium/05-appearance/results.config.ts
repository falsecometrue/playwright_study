import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import base from '../../solutions.config.js';
import { resultSettings } from '../../config/results.js';

export default defineConfig({
  ...base,
  testDir: fileURLToPath(new URL('.', import.meta.url)),
  projects: base.projects?.filter(project => project.name === 'solutions-chromium'),
  ...resultSettings('by-exercise/02_midium/05-appearance'),
});
