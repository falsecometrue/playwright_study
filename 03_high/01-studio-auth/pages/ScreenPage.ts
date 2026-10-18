import type { Page } from '@playwright/test';
import { screen } from './screen.js';

/** URL・要素名はscreen.ts、操作はここ、期待結果はテストで管理する。 */
export class ScreenPage {
  constructor(private readonly page: Page) {}
  get heading() { return this.page.getByRole('heading', { name: screen.heading, exact: true }); }
  get email() { return this.page.getByLabel(screen.elements.email.name, { exact: true }); }
  get password() { return this.page.getByLabel(screen.elements.password.name, { exact: true }); }
  get login() { return this.page.getByRole(screen.elements.login.kind, { name: screen.elements.login.name, exact: true }); }
  get account() { return this.page.getByRole(screen.elements.account.kind, { name: screen.elements.account.name, exact: true }); }
  get logout() { return this.page.getByRole(screen.elements.logout.kind, { name: screen.elements.logout.name, exact: true }); }
  get error() { return this.page.getByRole(screen.elements.error.kind); }
  async goto() { await this.page.goto(screen.path); }
  async signIn(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.login.click();
  }
}
