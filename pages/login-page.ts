import { Locator, Page, Response } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.getByPlaceholder('Email');
        this.passwordInput = page.getByPlaceholder('Password');
        this.signInButton = page.getByRole('button', { name: 'Sign in' });
    }

    async open() {
        await this.page.goto('/');
        await this.page.getByText('Sign in').click();
    }

    // Isi form login, klik Sign in, lalu kembalikan response API login
    async loginAndWaitResponse(email: string, password: string): Promise<Response> {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);

        const [response] = await Promise.all([
            this.page.waitForResponse(res =>
                res.url().includes('/api/users/login') && res.request().method() === 'POST'
            ),
            this.signInButton.click(),
        ]);
        return response;
    }
}
