import { test, expect } from '@playwright/test';
import { RegisterPage } from '../page-object/register-page';

const API_URL = 'https://conduit-api.bondaracademy.com/api';


const USER = {
    username: 'ahmddsdtzy',
    email: 'aadastsddszy@mail.com',
    password: 'pssswoddrd123',
};

test.describe.configure({ mode: 'default' });

let registerPage: RegisterPage;

test.beforeEach(async ({ page }) => {
    await page.goto('/'); // baseURL diambil dari playwright.config.ts
    registerPage = new RegisterPage(page);
    await registerPage.open();
});

test('As a user, I can register with valid username, email and password', async ({ page }) => {
    // Catatan: test ini hanya lolos jika USER belum pernah terdaftar
    const user = USER;
    const response = await registerPage.registerAndWaitResponse(user.username, user.email, user.password);

    // 1. Validasi response API register
    expect([200, 201]).toContain(response.status());
    const body = await response.json();
    expect(body.user.username).toBe(user.username);
    expect(body.user.email).toBe(user.email);
    expect(body.user.token).toBeTruthy();

    // 2. Validasi payload yang dikirim FE ke API
    const payload = response.request().postDataJSON();
    expect(payload.user).toMatchObject(user);

    // 3. Validasi UI: user langsung login setelah register
    await expect(page.locator('nav').getByText('New Article')).toBeVisible();
    await expect(page.locator('nav').getByText(user.username)).toBeVisible();
});

test('As a user, I cant register with email that already registered', async ({ page, request }) => {
    // Precondition: pastikan email USER sudah terdaftar
    // (201/200 = baru dibuat, 422 = memang sudah ada; keduanya OK)
    const setup = await request.post(`${API_URL}/users`, { data: { user: USER } });
    expect([200, 201, 422]).toContain(setup.status());

    // Register lagi via UI dengan email yang sama, username berbeda
    const response = await registerPage.registerAndWaitResponse(
        'ahmadtzy_duplikat', USER.email, USER.password
    );

    // 1. Validasi response API: ditolak, tidak ada data user
    expect(response.status()).toBe(500);
    const body = await response.json();
    expect(body.errors.email).toBeTruthy();
    expect(body.user).toBeUndefined();

    // 2. Validasi UI: pesan error muncul & tetap di halaman register
    await expect(page.getByText('email has already been taken')).toBeVisible();
    await expect(page).toHaveURL(/\/register/);
});

