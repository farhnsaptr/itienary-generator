# Itinerary Generator - Backend API

Backend RESTful API untuk aplikasi Itinerary Generator dibangun menggunakan **Express.js**, **TypeScript**, **Supabase (PostgreSQL)**, dan **Cloudflare R2**.

## Arsitektur & Keamanan

- **Auth**: Memakai dual-token JWT (Access Token 15 menit & Refresh Token 7 hari) yang tersimpan pada `httpOnly` cookie.
- **Database**: Menggunakan Supabase PostgreSQL yang diakses lewat `@supabase/supabase-js` dengan `SUPABASE_SERVICE_ROLE_KEY` (bypass RLS) — otorisasi sepenuhnya dikontrol pada layer service backend.
- **Storage**: Cloudflare R2 (S3-compatible) untuk menyimpan foto kegiatan dan cover image trip.
- **Dokumentasi API**: Interactive Swagger UI di `/api-docs`.

## Structure Folder

```
backend/
├── app.ts                  # Setup Express, middleware, CORS, Swagger UI
├── server.ts               # Entry point listener
├── src/
│   ├── config/             # env.ts (Zod env validation), cors.ts, swagger.ts
│   ├── lib/                # supabase.ts, r2Client.ts, jwt.ts
│   ├── middlewares/        # authGuard, adminGuard, validate, errorHandler
│   ├── modules/            # Vertical slice feature modules
│   │   ├── auth/           # Modul autentikasi
│   │   ├── users/          # Modul manajemen pengguna
│   │   ├── trips/          # Modul manajemen perjalanan
│   │   ├── trip-members/   # Modul anggota trip
│   │   ├── activities/     # Modul kegiatan
│   │   ├── activity-photos/# Modul foto kegiatan
│   │   └── admin/          # Modul dashboard admin
│   ├── routes/             # Aggregate Express router
│   ├── types/              # Global TypeScript declaration
│   └── utils/              # Helper utilities (asyncHandler)
```

## Cara Menjalankan

1. Salin `.env` ke direktori `backend/`
2. Install dependensi:
   ```bash
   npm install
   ```
3. Menjalankan server dalam mode development:
   ```bash
   npm run dev
   ```
4. Akses Swagger Documentation di `http://localhost:5000/api-docs`.
