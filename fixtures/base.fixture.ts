import { Response } from '@playwright/test';
import { test as base, createBdd } from 'playwright-bdd';
import { LoginPage } from '../pages/login-page';
import { RegisterPage } from '../pages/register-page';
import { Navbar } from '../pages/navbar';
import { UserData } from '../test-data/user.data';

// Penyimpan data per skenario, untuk membawa data dari step When ke step Then
export type ScenarioContext = {
    response?: Response;
    user?: Partial<UserData>;
};

type Fixtures = {
    ctx: ScenarioContext;
    loginPage: LoginPage;
    registerPage: RegisterPage;
    navbar: Navbar;
};

export const test = base.extend<Fixtures>({
    ctx: async ({}, use) => {
        await use({});
        // Tempat cleanup data test (mis. hapus data via API) kalau nanti dibutuhkan
    },
    loginPage: async ({ page }, use) => use(new LoginPage(page)),
    registerPage: async ({ page }, use) => use(new RegisterPage(page)),
    navbar: async ({ page }, use) => use(new Navbar(page)),
});

export const { Given, When, Then } = createBdd(test);
