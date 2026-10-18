import type { Page } from '@playwright/test';
import { screen } from './screen.js';

/** URL・要素名はscreen.ts、操作はここ、期待結果はテストで管理する。 */
export class ScreenPage {
  constructor(private readonly page: Page) {}
  get heading() { return this.page.getByRole('heading', { name: screen.heading, exact: true }); }
  get theme() { return this.page.getByLabel(screen.elements.theme.name); }
  get result() { return this.page.getByRole(screen.elements.result.kind); }
  async goto() { await this.page.goto(screen.path); }
  async selectTheme(theme: 'light' | 'dark') { await this.theme.selectOption(theme); }
}
