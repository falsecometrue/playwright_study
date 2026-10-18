import type { Page } from '@playwright/test';
import { screen } from './screen.js';

/** URL・要素名はscreen.ts、操作はここ、期待結果はテストで管理する。 */
export class ScreenPage {
  constructor(private readonly page: Page) {}
  get heading() { return this.page.getByRole('heading', { name: screen.heading, exact: true }); }
  get query() { return this.page.getByLabel(screen.elements.query.name, { exact: true }); }
  get status() { return this.page.getByRole(screen.elements.status.kind); }
  get rows() { return this.page.getByRole(screen.elements.rows.kind); }
  async goto() { await this.page.goto(screen.path); }
  async search(keyword: string) { await this.query.fill(keyword); }
}
