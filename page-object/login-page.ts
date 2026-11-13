import { Page, Response } from '@playwright/test';

export class LoginPage {

    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async open() {
        await this.page.getByText('Sign in').click();
    }

        async loginAndWaitResponse(email: string, password: string): Promise<Response> {
        await this.page.getByPlaceholder('Email').fill(email);
        await this.page.getByPlaceholder('Password').fill(password);

        const [response] = await Promise.all([
            this.page.waitForResponse(res =>
                res.url().includes('/api/users/login') && res.request().method() === 'POST'
            ),
            this.page.getByRole('button', { name: 'Sign in' }).click(),
        ]);
        return response;
    }
}
