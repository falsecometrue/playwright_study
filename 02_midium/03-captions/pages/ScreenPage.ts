import type { Page } from '@playwright/test';
import { screen } from './screen.js';

/** URL・要素名はscreen.ts、操作はここ、期待結果はテストで管理する。 */
export class ScreenPage {
  constructor(private readonly page: Page) {}
  get heading() { return this.page.getByRole('heading', { name: screen.heading, exact: true }); }
  get upload() { return this.page.getByLabel(screen.elements.upload.name, { exact: true }); }
  get download() { return this.page.getByRole(screen.elements.download.kind, { name: screen.elements.download.name, exact: true }); }
  get result() { return this.page.getByRole(screen.elements.result.kind); }
  async goto() { await this.page.goto(screen.path); }
  async uploadFile(file: string) { await this.upload.setInputFiles(file); }
}
