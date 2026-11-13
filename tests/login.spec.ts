import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-object/login-page';

const EMAIL = process.env.CONDUIT_EMAIL!;
const PASSWORD = process.env.CONDUIT_PASSWORD!;

let loginPage: LoginPage;

test.beforeEach(async ({ page }) => {
    await page.goto('/'); // baseURL diambil dari playwright.config.ts
    loginPage = new LoginPage(page);
    await loginPage.open();
});

test('As a user, I can login with valid email and password', async ({ page }) => {
    const response = await loginPage.loginAndWaitResponse(EMAIL, PASSWORD);

    // 1. Validasi response API login
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.user.email).toBe(EMAIL);
    expect(body.user.token).toBeTruthy();
    expect(body.user.username).toBeTruthy();

    // 2. Validasi payload yang dikirim FE ke API
    const payload = response.request().postDataJSON();
    expect(payload.user).toMatchObject({ email: EMAIL, password: PASSWORD });

    // 3. Validasi UI: user sudah login
    await expect(page.locator('nav').getByText('New Article')).toBeVisible();
    await expect(page.locator('nav').getByText(body.user.username)).toBeVisible();
});

test('As a user, I cant login with wrong password', async ({ page }) => {
    const response = await loginPage.loginAndWaitResponse(EMAIL, 'passwordSalah123');

    // 1. Validasi response API: ditolak, tidak ada token
    expect(response.status()).toBe(403);
    const body = await response.json();
    expect(body.errors).toBeTruthy();
    expect(body.user).toBeUndefined();

    // 2. Validasi UI: pesan error muncul & tetap di halaman login
    await expect(page.getByText('email or password is invalid')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
});

test('As a user, I cant login when server error', async ({ page }) => {
    // Mock: API login dibalas 500, request tidak sampai ke server asli
    await page.route('**/api/users/login', route =>
        route.fulfill({ status: 500, json: { errors: { server: ['Internal Server Error'] } } })
    );

    const response = await loginPage.loginAndWaitResponse(EMAIL, PASSWORD);

    expect(response.status()).toBe(500);
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('nav').getByText('New Article')).toBeHidden();
});
