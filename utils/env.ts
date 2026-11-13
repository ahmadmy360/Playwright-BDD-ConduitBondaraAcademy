/**
 * Ambil environment variable wajib dari file .env.
 * Test langsung gagal dengan pesan jelas kalau variabelnya belum diisi.
 */
export function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable "${name}" belum diisi. Salin .env.example menjadi .env lalu isi nilainya.`);
    }
    return value;
}
