# Modul Frontend: Auth

Modul ini bertanggung jawab mengelola antarmuka autentikasi pengguna (Login & Registrasi), penanganan form validation (React Hook Form + Zod), integrasi API auth via Axios `withCredentials: true`, dan pengikatan state pengguna ke Zustand `authStore`.

## Struktur Modul

```
src/features/auth/
├── components/        # UI murni (LoginForm.tsx, RegisterForm.tsx)
├── hooks/             # Logic, React Query mutations & router redirect (useAuth.ts)
├── services/          # Pure API client calls (authService.ts)
├── types/             # TypeScript interfaces & Zod schemas (auth.types.ts)
├── index.ts           # Barrel export
└── README.md          # Dokumentasi modul
```

## Fitur Utama

- **LoginForm**: Mengamankan input login pengguna dengan efek *shake animation* pada error.
- **RegisterForm**: Pendaftaran akun baru dengan validasi instan.
- **useAuth Hook**: Mengsinkronkan profil user dari `GET /api/auth/me` saat aplikasi di-refresh dan menangani mutasi login/register/logout.
