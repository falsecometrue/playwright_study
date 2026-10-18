import type { Page } from '@playwright/test';
import { screen } from './screen.js';

/** URL・要素名はscreen.ts、操作はここ、期待結果はテストで管理する。 */
export class ScreenPage {
  constructor(private readonly page: Page) {}
  get heading() { return this.page.getByRole('heading', { name: screen.heading, exact: true }); }
  get task() { return this.page.getByLabel(screen.elements.task.name, { exact: true }); }
  get add() { return this.page.getByRole(screen.elements.add.kind, { name: screen.elements.add.name, exact: true }); }
  get rows() { return this.page.getByRole(screen.elements.rows.kind); }
  async goto() { await this.page.goto(screen.path); }
}
