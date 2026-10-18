import { expect, type Page, type Locator } from '@playwright/test';
import { screen } from './screen.js';

export class VideoFeedPage {
  readonly videos: Locator;
  readonly watchLater: Locator;
  constructor(private readonly page: Page) {
    this.videos = page.getByRole(screen.elements.videos.kind);
    this.watchLater = page.getByRole(screen.elements.watchLater.kind);
  }
  async goto() { await this.page.goto(screen.path); }
  async expectInitialLayout() {
    const navigation = this.page.getByRole(screen.elements.navigation.kind, { name: screen.elements.navigation.name });
    const menu = this.page.getByRole(screen.elements.menu.kind, { name: screen.elements.menu.name, exact: true });
    if (await menu.isVisible()) {
      await expect(navigation).toBeHidden();
      await expect(menu).toHaveAttribute('aria-expanded', 'false');
    } else { await expect(navigation).toBeVisible(); }
  }
  async selectCategory(name: '学習' | 'すべて') {
    const navigation = this.page.getByRole(screen.elements.navigation.kind, { name: screen.elements.navigation.name });
    // 画面幅そのものではなく、UIの状態からメニュー操作の要否を決める。
    if (!await navigation.isVisible()) {
      await this.page.getByRole(screen.elements.menu.kind, { name: screen.elements.menu.name, exact: true }).click();
    }
    await navigation.getByRole('button', { name, exact: true }).click();
  }
  async saveVideo(name: string) {
    await this.videos.filter({ has: this.page.getByText(name, { exact: true }) })
      .getByRole('button', { name: '追加', exact: true }).click();
  }
}
