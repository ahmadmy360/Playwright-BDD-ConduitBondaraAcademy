import { expect } from '@playwright/test';
import { Then } from '../fixtures/base.fixture';

// Step umum yang dipakai lintas feature

Then('the API should respond with status {int}', async ({ ctx }, status: number) => {
    expect(ctx.response!.status()).toBe(status);
});

Then('I should see error message {string}', async ({ page }, message: string) => {
    await expect(page.getByText(message)).toBeVisible();
});

Then('I should stay on the {string} page', async ({ page }, path: string) => {
    await expect(page).toHaveURL(new RegExp(`/${path}`));
});

Then('I should be logged in', async ({ navbar, ctx }) => {
    const { user } = await ctx.response!.json();
    await expect(navbar.newArticleLink).toBeVisible();
    await expect(navbar.username(user.username)).toBeVisible();
});

Then('I should not be logged in', async ({ navbar }) => {
    await expect(navbar.newArticleLink).toBeHidden();
});
