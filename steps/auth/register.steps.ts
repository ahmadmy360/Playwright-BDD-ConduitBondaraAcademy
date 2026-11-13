import { expect } from '@playwright/test';
import { Given, When, Then } from '../../fixtures/base.fixture';
import { buildNewUser, registeredUser } from '../../test-data/user.data';

Given('I open the sign up page', async ({ registerPage }) => {
    await registerPage.open();
});

When('I register with a new valid account', async ({ registerPage, ctx }) => {
    const user = buildNewUser(); // unik setiap run, jadi test bisa diulang
    ctx.user = user;
    ctx.response = await registerPage.registerAndWaitResponse(user);
});

When('I register using an email that is already registered', async ({ registerPage, ctx }) => {
    // Precondition: email akun di .env pasti sudah terdaftar
    const user = { ...buildNewUser(), email: registeredUser().email };
    ctx.user = user;
    ctx.response = await registerPage.registerAndWaitResponse(user);
});

Then('the registration should be successful', async ({ ctx }) => {
    const res = ctx.response!;
    const user = ctx.user!;

    // 1. Validasi response API register
    expect([200, 201]).toContain(res.status());
    const body = await res.json();
    expect(body.user.username).toBe(user.username);
    expect(body.user.email).toBe(user.email);
    expect(body.user.token).toBeTruthy();

    // 2. Validasi payload yang dikirim FE ke API
    expect(res.request().postDataJSON().user).toMatchObject(user);
});

Then('the registration should be rejected because the email is taken', async ({ ctx }) => {
    // Catatan: API Conduit Bondar Academy membalas 500 untuk email duplikat
    expect(ctx.response!.status()).toBe(500);
    const body = await ctx.response!.json();
    expect(body.errors.email).toBeTruthy();
    expect(body.user).toBeUndefined();
});
