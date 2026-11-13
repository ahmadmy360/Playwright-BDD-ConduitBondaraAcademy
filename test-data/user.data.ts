import { faker } from '@faker-js/faker';
import { requireEnv } from '../utils/env';

export type UserData = {
    username: string;
    email: string;
    password: string;
};

// User baru yang unik setiap run, supaya test register bisa diulang
export function buildNewUser(): UserData {
    const suffix = `${Date.now()}${faker.number.int({ min: 100, max: 999 })}`;
    return {
        username: `qa${faker.internet.username().replace(/[^a-zA-Z0-9]/g, '').slice(0, 6)}${suffix.slice(-8)}`.toLowerCase(),
        email: `qa.${suffix}@mail.com`,
        password: faker.internet.password({ length: 12 }),
    };
}

// Akun yang sudah terdaftar, diambil dari .env
export function registeredUser(): Pick<UserData, 'email' | 'password'> {
    return {
        email: requireEnv('CONDUIT_EMAIL'),
        password: requireEnv('CONDUIT_PASSWORD'),
    };
}
