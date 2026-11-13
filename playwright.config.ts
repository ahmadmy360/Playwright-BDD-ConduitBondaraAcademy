import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import 'dotenv/config'; // baca file .env

// Generate test Playwright dari file .feature ke folder .features-gen/
const testDir = defineBddConfig({
    features: 'features/**/*.feature',
    steps: ['steps/**/*.ts', 'fixtures/**/*.ts'],
});

export default defineConfig({
    testDir,
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
        reporter: [
        ['list'],
        ['html', { open: 'never' }],
        ['allure-playwright', { resultsDir: 'allure-results' }],
    ],
    use: {
        baseURL: 'https://conduit.bondaracademy.com',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },
    projects: [
        { name: 'chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
    ],
});
