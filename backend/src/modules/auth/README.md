# Modul Auth

Modul ini bertanggung jawab menangani alur autentikasi dan manajemen sesi pengguna menggunakan strategi **dual-token JWT** (access token pendek + refresh token panjang) yang disimpan dalam **httpOnly cookie**.

## Fitur Utama

- **Register**: Pendaftaran pengguna baru dengan password hashing (bcrypt).
- **Login**: Autentikasi dengan username/email dan password, menerbitkan `accessToken` (15m) & `refreshToken` (7d).
- **Refresh Token**: Memperbarui access token yang kedaluwarsa dengan memverifikasi hash refresh token pada tabel `refresh_tokens`.
- **Logout**: Merevoke refresh token dari database dan membersihkan cookie.
- **Get Me**: Mengambil data profil user yang sedang login via `authGuard`.

## Struktur Folder

```
src/modules/auth/
├── auth.controller.ts     # HTTP Request & Cookie handler
├── auth.service.ts        # Business logic & Database calls via Supabase
├── auth.routes.ts         # Express Routing & Dokumentasi Swagger
├── auth.validation.ts     # Zod schema validation
├── auth.types.ts          # TypeScript interfaces
├── index.ts               # Barrel export
└── README.md              # Dokumentasi modul
```

## Endpoints

| Method | Endpoint | Auth Required | Deskripsi |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Pendaftaran akun baru |
| POST | `/api/auth/login` | ❌ | Autentikasi akun & set cookie |
| POST | `/api/auth/refresh` | ❌ (Cookie) | Perbarui token |
| POST | `/api/auth/logout` | ❌ (Cookie) | Logout & hapus cookie |
| GET | `/api/auth/me` | ✅ | Ambil profil pengguna |
