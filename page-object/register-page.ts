import { Page, Response } from '@playwright/test';

export class RegisterPage {

    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async open() {
        await this.page.getByText('Sign up').click();
    }

    // Isi form register, klik Sign up, lalu kembalikan response API register
    async registerAndWaitResponse(username: string, email: string, password: string): Promise<Response> {
        await this.page.getByPlaceholder('Username').fill(username);
        await this.page.getByPlaceholder('Email').fill(email);
        await this.page.getByPlaceholder('Password').fill(password);

        const [response] = await Promise.all([
            this.page.waitForResponse(res =>
                /\/api\/users\/?$/.test(res.url()) && res.request().method() === 'POST'
            ),
            this.page.getByRole('button', { name: 'Sign up' }).click(),
        ]);
        return response;
    }
}
