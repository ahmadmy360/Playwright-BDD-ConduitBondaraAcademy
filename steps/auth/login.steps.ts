import { expect } from '@playwright/test';
import { Given, When, Then } from '../../fixtures/base.fixture';
import { registeredUser } from '../../test-data/user.data';

Given('I open the sign in page', async ({ loginPage }) => {
    await loginPage.open();
});

Given('the login API returns server error', async ({ page }) => {
    // Mock: API login dibalas 500, request tidak sampai ke server asli
    await page.route('**/api/users/login', route =>
        route.fulfill({ status: 500, json: { errors: { server: ['Internal Server Error'] } } })
    );
});

When('I login with my registered account', async ({ loginPage, ctx }) => {
    ctx.user = registeredUser();
    ctx.response = await loginPage.loginAndWaitResponse(ctx.user.email!, ctx.user.password!);
});

When('I login with my registered email and password {string}', async ({ loginPage, ctx }, password: string) => {
    ctx.user = { email: registeredUser().email, password };
    ctx.response = await loginPage.loginAndWaitResponse(ctx.user.email!, password);
});

Then('the login should be successful', async ({ ctx }) => {
    const res = ctx.response!;

    // 1. Validasi response API login
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.user.email).toBe(ctx.user!.email);
    expect(body.user.token).toBeTruthy();
    expect(body.user.username).toBeTruthy();

    // 2. Validasi payload yang dikirim FE ke API
    expect(res.request().postDataJSON().user).toMatchObject(ctx.user!);
});

Then('the login should be rejected', async ({ ctx }) => {
    // Validasi response API: ditolak, tidak ada token
    expect(ctx.response!.status()).toBe(403);
    const body = await ctx.response!.json();
    expect(body.errors).toBeTruthy();
    expect(body.user).toBeUndefined();
});
