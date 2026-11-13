import { Locator, Page } from '@playwright/test';

// Komponen navbar dipakai di banyak halaman, jadi dibuat terpisah
export class Navbar {
    readonly nav: Locator;
    readonly newArticleLink: Locator;

    constructor(page: Page) {
        this.nav = page.locator('nav');
        this.newArticleLink = this.nav.getByText('New Article');
    }

    username(name: string): Locator {
        return this.nav.getByText(name);
    }
}
