# Playwright BDD – Test Auth Conduit (Validasi API + UI)

Automation test fitur **Login** dan **Register** di [Conduit](https://conduit.bondaracademy.com) memakai **Playwright + TypeScript + playwright-bdd (Gherkin)** dengan pola **Page Object Model**. Setiap skenario memvalidasi **response API**, **payload FE**, dan **UI**.

## Struktur Project

```
playwright/
├── features/                    # Skenario Gherkin (bahasa bisnis), per modul
│   └── auth/
│       ├── login.feature
│       └── register.feature
├── steps/                       # Step definition (Given/When/Then)
│   ├── auth/
│   │   ├── login.steps.ts
│   │   └── register.steps.ts
│   └── common.steps.ts          # Step umum: status API, pesan error, URL, navbar
├── pages/                       # Page Object: locator & aksi (tanpa assertion)
│   ├── login-page.ts
│   ├── register-page.ts
│   └── navbar.ts
├── fixtures/
│   └── base.fixture.ts          # Inject page object + ctx (data per skenario)
├── test-data/
│   └── user.data.ts             # User baru (faker) & user terdaftar (.env)
├── utils/
│   └── env.ts                   # Baca .env, error jelas kalau belum diisi
├── .github/workflows/playwright.yml   # CI GitHub Actions
├── allure-results/            # Hasil mentah Allure (otomatis, tidak di-commit)
├── allure-report/             # Allure report HTML (otomatis, tidak di-commit)
├── .features-gen/               # Hasil generate bddgen (otomatis, tidak di-commit)
├── .env.example / .env          # Kredensial (.env TIDAK di-commit)
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

Alur: **feature** (apa yang dites) → **steps** (cara mengetes) → **pages** (interaksi UI).

## 1. Prasyarat

| Tools | Cek versi | Download |
|---|---|---|
| Node.js (LTS) | `node -v` | https://nodejs.org |
| npm | `npm -v` | ikut terpasang dengan Node.js |
| Google Chrome | – | https://www.google.com/chrome |
| VS Code (opsional) | – | https://code.visualstudio.com |

> Config memakai `channel: 'chrome'`, jadi test berjalan di **Google Chrome** yang terpasang di laptop.

Extension VS Code yang disarankan: **Playwright Test for VSCode** (Microsoft) dan **Cucumber (Gherkin) Full Support** untuk highlight & lompat dari `.feature` ke step.

## 2. Install Dependency

```bash
cd ~/Downloads/playwright
npm install
```

## 3. Isi Kredensial di `.env`

Buat akun di https://conduit.bondaracademy.com (menu **Sign up**), lalu:

```bash
cp .env.example .env
```

```
CONDUIT_EMAIL=email_kamu@mail.com
CONDUIT_PASSWORD=password_kamu
```

Akun ini dipakai untuk skenario login dan sebagai email "sudah terdaftar" di skenario register duplikat.

## 4. Jalankan Test

| Perintah | Fungsi |
|---|---|
| `npm test` | Semua skenario |
| `npm run test:smoke` | Hanya skenario `@smoke` (happy path) |
| `npm run test:login` | Hanya feature `@login` |
| `npm run test:register` | Hanya feature `@register` |
| `npm run test:headed` | Browser terlihat |
| `npm run test:ui` | Playwright UI mode |
| `npm run report` | Buka HTML report Playwright |
| `npm run test:allure` | Hapus hasil lama → jalankan test → buka Allure report |
| `npm run allure:report` | Generate & buka Allure report dari hasil test terakhir |
| `npm run typecheck` | Cek error TypeScript |

> Setiap script menjalankan `bddgen` dulu untuk mengubah `.feature` jadi test Playwright. Kalau menjalankan `npx playwright test` langsung, jalankan `npx bddgen` lebih dulu.

## Allure Report

Setiap `npm test` otomatis menyimpan hasil mentah ke `allure-results/` (reporter `allure-playwright`). Allure yang dipakai adalah **Allure 3** versi npm, jadi **tidak perlu Java**.

```bash
npm run test:allure      # cara paling praktis: bersihkan, jalankan test, buka report
```

Atau satu per satu:

```bash
npm run allure:clean     # hapus allure-results/ & allure-report/ lama
npm test                 # jalankan test, hasil masuk allure-results/
npm run allure:generate  # buat report HTML di allure-report/
npm run allure:open      # buka report di browser (Ctrl+C untuk berhenti)
```

Di Allure, setiap skenario menampilkan step Given/When/Then, tag (`@smoke`, `@login`, `@register`), screenshot saat gagal, dan error detail.

> Jalankan `allure:clean` sebelum test kalau tidak ingin hasil run sebelumnya ikut tergabung di report.

## Skenario Test

| Feature | Skenario | Validasi API | Validasi UI |
|---|---|---|---|
| Login | As a user, I can login with valid email and password | Status 200, email cocok, token & username ada, payload FE sesuai | "New Article" & username tampil di navbar |
| Login | As a user, I cant login with wrong password | Status 403, ada `errors`, tidak ada `user` | Pesan "email or password is invalid", tetap di /login |
| Login | As a user, I cant login when server error | Response di-mock 500 | Tetap di /login, belum login |
| Register | As a user, I can register with valid username, email and password | Status 200/201, username & email cocok, token ada, payload FE sesuai | Langsung login (navbar) |
| Register | As a user, I cant register with email that already registered | Status 500, ada `errors.email`, tidak ada `user` | Pesan "email has already been taken", tetap di /register |

## Aturan Penulisan

- Judul scenario: `As a user, I can ...` / `As a user, I cant ...`
- `.feature` ditulis dari sudut pandang user, **tanpa** selector atau detail teknis.
- `When` = melakukan aksi & menyimpan response ke `ctx`. `Then` = semua assertion (API + UI).
- Page object **tidak** berisi assertion.
- Step yang dipakai lebih dari satu feature taruh di `steps/common.steps.ts`.
- Data test dibuat unik (lihat `test-data/user.data.ts`) supaya test bisa diulang.
- Tag: `@smoke` untuk happy path, tag per feature (`@login`, `@register`) untuk run sebagian.

## CI (GitHub Actions)

Workflow `.github/workflows/playwright.yml` menjalankan `npm test` setiap push/PR ke `main`/`master`. Tambahkan secret **`CONDUIT_EMAIL`** dan **`CONDUIT_PASSWORD`** di **Settings → Secrets and variables → Actions**.

## Troubleshooting

| Error | Penyebab | Solusi |
|---|---|---|
| `Environment variable "CONDUIT_EMAIL" belum diisi` | `.env` belum dibuat / nama variabel salah | Cek file `.env` di root project |
| `Missing step definition` | Teks step di `.feature` tidak cocok dengan steps | Samakan teksnya, atau salin snippet yang disarankan bddgen |
| `No tests found` | `bddgen` belum dijalankan | Pakai `npm test`, bukan `npx playwright test` |
| `Timeout ... waitForResponse` | URL API tidak cocok dengan filter | Cek URL di DevTools, ubah filter di `pages/*.ts` |
| Status 403 di skenario login valid | Email/password di `.env` salah | Coba login manual dengan kredensial yang sama |
| `Chromium distribution 'chrome' is not found` | Google Chrome belum terpasang | Install Chrome, atau hapus `channel: 'chrome'` di config |
| `strict mode violation` | Locator menemukan >1 elemen | Persempit locator, mis. lewat `pages/navbar.ts` |
# Playwright-BDD-ConduitBondaraAcademy
