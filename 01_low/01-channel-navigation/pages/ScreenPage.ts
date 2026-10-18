import type { Page } from '@playwright/test';
import { screen } from './screen.js';

/** URL・要素名はscreen.ts、操作はここ、期待結果はテストで管理する。 */
export class ScreenPage {
  constructor(private readonly page: Page) {}
  get heading() { return this.page.getByRole('heading', { name: screen.heading, exact: true }); }
  get about() { return this.page.getByRole(screen.elements.about.kind, { name: screen.elements.about.name, exact: true }); }
  get home() { return this.page.getByRole(screen.elements.home.kind, { name: screen.elements.home.name, exact: true }); }
  async goto() { await this.page.goto(screen.path); }
}
