import { defineConfig } from '@playwright/test';
import solutions from '../../solutions.config.js';

export default defineConfig({
  ...solutions,
  projects: solutions.projects?.filter(project => project.name?.startsWith('feed-')),
});
