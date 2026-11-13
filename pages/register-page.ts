import { Locator, Page, Response } from '@playwright/test';
import { UserData } from '../test-data/user.data';

export class RegisterPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly signUpButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByPlaceholder('Username');
        this.emailInput = page.getByPlaceholder('Email');
        this.passwordInput = page.getByPlaceholder('Password');
        this.signUpButton = page.getByRole('button', { name: 'Sign up' });
    }

    async open() {
        await this.page.goto('/');
        await this.page.getByText('Sign up').click();
    }

    // Isi form register, klik Sign up, lalu kembalikan response API register
    async registerAndWaitResponse(user: UserData): Promise<Response> {
        await this.usernameInput.fill(user.username);
        await this.emailInput.fill(user.email);
        await this.passwordInput.fill(user.password);

        const [response] = await Promise.all([
            this.page.waitForResponse(res =>
                /\/api\/users\/?$/.test(res.url()) && res.request().method() === 'POST'
            ),
            this.signUpButton.click(),
        ]);
        return response;
    }
}
