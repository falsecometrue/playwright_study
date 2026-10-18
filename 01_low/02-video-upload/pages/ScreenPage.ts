import type { Page } from '@playwright/test';
import { screen } from './screen.js';

export class ScreenPage {
  constructor(private readonly page: Page) {}
  get heading() { return this.page.getByRole('heading', { name: screen.heading, exact: true }); }
  async goto() { await this.page.goto(screen.path); }
  get titleInput() { return this.page.getByLabel(screen.elements.titleInput.name, { exact: true }); }
  get visibility() { return this.page.getByLabel(screen.elements.visibility.name, { exact: true }); }
  get rights() { return this.page.getByLabel(screen.elements.rights.name, { exact: true }); }
  get save() { return this.page.getByRole(screen.elements.save.kind, { name: screen.elements.save.name, exact: true }); }
  get result() { return this.page.getByRole(screen.elements.result.kind); }
}
