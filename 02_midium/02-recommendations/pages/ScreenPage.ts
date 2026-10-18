import type { Page } from '@playwright/test';
import { screen } from './screen.js';

/** URL・要素名はscreen.ts、操作はここ、期待結果はテストで管理する。 */
export class ScreenPage {
  constructor(private readonly page: Page) {}
  get heading() { return this.page.getByRole('heading', { name: screen.heading, exact: true }); }
  get load() { return this.page.getByRole(screen.elements.load.kind, { name: screen.elements.load.name, exact: true }); }
  get rows() { return this.page.getByRole(screen.elements.rows.kind); }
  get error() { return this.page.getByRole(screen.elements.error.kind); }
  async goto() { await this.page.goto(screen.path); }
  async loadRecommendations() { await this.load.click(); }
}
