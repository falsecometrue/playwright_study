import type { Page } from '@playwright/test';
import { screen } from './screen.js';

/** URL・要素名はscreen.ts、操作はここ、期待結果はテストで管理する。 */
export class ScreenPage {
  constructor(private readonly page: Page) {}
  get heading() { return this.page.getByRole('heading', { name: screen.heading, exact: true }); }
  get receipt() { return this.page.getByRole(screen.elements.receipt.kind, { name: screen.elements.receipt.name, exact: true }); }
  get deleteButton() { return this.page.getByRole(screen.elements.deleteButton.kind, { name: screen.elements.deleteButton.name, exact: true }); }
  get result() { return this.page.getByRole(screen.elements.result.kind); }
  async goto() { await this.page.goto(screen.path); }
  get playerFrame() { return this.page.frameLocator('iframe[title="埋め込みプレイヤー"]'); }
  async seekTo(address: string) {
    await this.playerFrame.getByLabel('再生位置（秒）', { exact: true }).fill(address);
    await this.playerFrame.getByRole('button', { name: '移動', exact: true }).click();
  }
}
