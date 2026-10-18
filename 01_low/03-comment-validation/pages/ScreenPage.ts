import type { Page } from '@playwright/test';
import { screen } from './screen.js';

export class ScreenPage {
  constructor(private readonly page: Page) {}
  get heading() { return this.page.getByRole('heading', { name: screen.heading, exact: true }); }
  async goto() { await this.page.goto(screen.path); }
  get author() { return this.page.getByLabel(screen.elements.author.name, { exact: true }); }
  get comment() { return this.page.getByLabel(screen.elements.comment.name, { exact: true }); }
  get submit() { return this.page.getByRole(screen.elements.submit.kind, { name: screen.elements.submit.name, exact: true }); }
  get error() { return this.page.getByRole(screen.elements.error.kind); }
  get result() { return this.page.getByRole(screen.elements.result.kind); }
}
