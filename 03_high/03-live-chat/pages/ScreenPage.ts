import type { Page } from '@playwright/test';
import { screen } from './screen.js';

/** URL・要素名はscreen.ts、操作はここ、期待結果はテストで管理する。 */
export class ScreenPage {
  constructor(private readonly page: Page) {}
  get heading() { return this.page.getByRole('heading', { name: screen.heading, exact: true }); }
  get room() { return this.page.getByLabel(screen.elements.room.name, { exact: true }); }
  get user() { return this.page.getByLabel(screen.elements.user.name, { exact: true }); }
  get join() { return this.page.getByRole(screen.elements.join.kind, { name: screen.elements.join.name, exact: true }); }
  get message() { return this.page.getByLabel(screen.elements.message.name, { exact: true }); }
  get send() { return this.page.getByRole(screen.elements.send.kind, { name: screen.elements.send.name, exact: true }); }
  get rows() { return this.page.getByRole(screen.elements.rows.kind); }
  async goto() { await this.page.goto(screen.path); }
  async joinRoom(room: string, user: string) {
    await this.room.fill(room);
    await this.user.fill(user);
    await this.join.click();
  }
  async sendMessage(text: string) {
    await this.message.fill(text);
    await this.send.click();
  }
}
