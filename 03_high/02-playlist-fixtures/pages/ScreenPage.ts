import type { Page } from '@playwright/test';
import { screen } from './screen.js';

/** URL・要素名はscreen.ts、操作はここ、期待結果はテストで管理する。 */
export class ScreenPage {
  constructor(private readonly page: Page) {}
  get heading() { return this.page.getByRole('heading', { name: screen.heading, exact: true }); }
  get playlist() { return this.page.getByLabel(screen.elements.playlist.name, { exact: true }); }
  get load() { return this.page.getByRole(screen.elements.load.kind, { name: screen.elements.load.name, exact: true }); }
  get rows() { return this.page.getByRole(screen.elements.rows.kind); }
  async goto() { await this.page.goto(screen.path); }
  async loadPlaylist(playlist: string) {
    await this.playlist.fill(playlist);
    await this.load.click();
  }
}
