import type { Page } from '@playwright/test';
import { screen } from './screen.js';

export class ScreenPage {
  constructor(private readonly page: Page) {}
  get heading() { return this.page.getByRole('heading', { name: screen.heading, exact: true }); }
  async goto() { await this.page.goto(screen.path); }
  get video() { return this.page.getByRole('region', { name: screen.elements.video.name, exact: true }); }
  get channel() { return this.page.getByRole('region', { name: screen.elements.channel.name, exact: true }); }
  get like() { return this.video.getByRole('button', { name: '高評価', exact: true }); }
  get likes() { return this.video.getByRole('status'); }
  get subscriptionButton() { return this.channel.getByRole('button'); }
  get subscription() { return this.channel.getByRole('status'); }
}
