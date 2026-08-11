# Project Brief: Itinerary Generator

> Dokumen ini adalah arahan utama untuk siapapun (developer/AI agent) yang melanjutkan pengembangan project ini. Baca seluruh dokumen sebelum mulai coding.


---

## 1. Deskripsi Project

Aplikasi web untuk membuat itinerary perjalanan secara kolaboratif. Pengguna dapat membuat trip, mengundang anggota lain, menambahkan kegiatan dengan rentang waktu tertentu beserta foto, lalu memvisualisasikannya dalam bentuk **timeline kreatif** (tidak kaku, berwarna, banyak animasi ringan) yang bisa **di-export ke PDF**.

### Fitur Inti
1. Autentikasi user (JWT httpOnly cookie)
2. CRUD Trip (dengan tanggal mulai-selesai)
3. Menambahkan anggota trip lewat username/UUID
4. CRUD Kegiatan dalam trip (judul, lokasi, tanggal, jam mulai-selesai, icon, warna)
5. Upload foto per kegiatan (disimpan di Cloudflare R2)
6. Visualisasi timeline kreatif per hari
7. Export timeline ke PDF
8. Dashboard admin (kelola user, lihat semua trip)

---

## 2. Alur Kerja Sistem (User Flow)

```
1. User login/register
   └── JWT access token + refresh token disimpan di httpOnly cookie

2. User membuat trip baru
   └── Isi: nama, deskripsi, tanggal mulai, tanggal selesai, warna tema
   └── User pembuat otomatis jadi role "owner" di trip_members

3. User menambahkan anggota trip lain
   └── Cari user lain lewat username, masukkan ke trip_members sebagai "member"

4. User menambahkan kegiatan dalam trip
   └── Pilih tanggal (harus dalam rentang start_date - end_date trip)
   └── Isi jam mulai & jam selesai (contoh: 13:00 - 17:00, "Pergi ke pantai")
   └── Pilih icon (lucide-react) dan warna kartu
   └── (Opsional) Upload foto terkait kegiatan → tersimpan di R2, URL disimpan di DB

5. Sistem menampilkan visualisasi timeline
   └── Dikelompokkan per hari (tab/section per activity_date)
   └── Kartu kegiatan diposisikan berdasarkan jam, dengan warna & icon masing-masing
   └── Foto ditampilkan sebagai thumbnail di kartu kegiatan

6. User export timeline ke PDF
   └── Generate dari tampilan timeline (html2canvas + jspdf) atau render ulang layout khusus print

7. [Terpisah] Admin login
   └── Bisa menambahkan/mengelola user
   └── Bisa melihat seluruh trip yang dibuat semua user (lewat view admin_trip_overview)
```

---

## 3. Tech Stack

| Layer | Teknologi | Keterangan |
|---|---|---|
| Frontend | React 19 + Vite | SPA |
| Styling | Tailwind CSS v4 | Config via CSS (`@theme`), bukan `tailwind.config.js` |
| Backend | Express + TypeScript | REST API |
| Database | Supabase (PostgreSQL) | Akses lewat `service_role` key dari backend |
| File Storage | Cloudflare R2 | S3-compatible, untuk foto kegiatan |
| Auth | JWT (dual-token) via httpOnly cookie | Access token pendek + refresh token |
| Icons | lucide-react | Konsisten dipakai di seluruh UI |
| API Docs | Swagger (swagger-jsdoc + swagger-ui-express) | Tersedia di `/api-docs` (dev only) |

### Deployment (rencana)
- Backend: Render (Singapore region) — alternatif: Fly.io, Railway
- Frontend: Vercel/Netlify/Cloudflare Pages (belum difinalkan)
- Database: Supabase cloud
- Storage: Cloudflare R2

---

## 4. Struktur Folder

```
itinerary-generator/
├── frontend/
│   └── src/
│       ├── app/              # App.tsx, router.tsx, providers.tsx
│       ├── features/         # 1 folder = 1 fitur (auth, trips, activities, timeline, export-pdf, admin, trip-members)
│       │   └── [nama-fitur]/
│       │       ├── components/
│       │       ├── hooks/
│       │       ├── services/
│       │       ├── types/
│       │       └── index.ts  # barrel export
│       ├── components/       # UI generik lintas fitur (ui/, layout/)
│       ├── layouts/          # AuthLayout, DashboardLayout, AdminLayout
│       ├── pages/            # Route-level, compose dari features/
│       ├── lib/              # axios instance, queryClient
│       ├── store/            # zustand (authStore, dll)
│       ├── hooks/            # hooks generik (useDebounce, dll)
│       ├── types/            # tipe global
│       ├── utils/            # pure function helper
│       └── styles/           # globals.css (berisi @import "tailwindcss")
│
├── backend/
│   └── src/
│       ├── modules/          # 1 folder = 1 fitur, mirror dari frontend/features
│       │   └── [nama-modul]/
│       │       ├── *.controller.ts
│       │       ├── *.service.ts
│       │       ├── *.routes.ts
│       │       ├── *.validation.ts   # zod schema
│       │       └── *.types.ts
│       ├── middlewares/      # authGuard, adminGuard, errorHandler, rateLimiter, validate
│       ├── lib/               # supabase.ts, r2Client.ts, jwt.ts, logger.ts
│       ├── config/            # env.ts, cors.ts, swagger.ts
│       ├── routes/            # index.ts — gabungkan semua module routes
│       ├── types/             # express.d.ts (extend Request)
│       ├── utils/             # asyncHandler.ts
│       ├── app.ts             # setup express app
│       └── server.ts          # entry point
│
├── schema_itinerary.sql       # source of truth skema database (jalankan di Supabase SQL Editor)
└── .gitignore
```

**Prinsip modular yang dipegang:**
- Vertical slice per fitur (bukan dipisah per tipe file secara horizontal).
- Barrel export (`index.ts`) di tiap feature frontend — komponen luar hanya import dari `features/nama-fitur`.
- Backend: setiap module wajib punya pemisahan *controller → service → routes*, logic bisnis tidak boleh menumpuk di controller.
- `lib/` = wrapper eksternal (axios, supabase client, R2 client, JWT). `utils/` = pure function helper.

---

## 5. Skema Database

Skema lengkap ada di file `schema_itinerary.sql` (jalankan di Supabase SQL Editor). Ringkasan tabel:

| Tabel | Fungsi |
|---|---|
| `users` | Data akun + role (`admin`/`user`), password hash |
| `refresh_tokens` | Menyimpan hash refresh token untuk revoke saat logout |
| `trips` | Data trip (nama, tanggal, warna tema) |
| `trip_members` | Relasi many-to-many user ↔ trip, dengan role `owner`/`member` |
| `activities` | Kegiatan dalam trip (tanggal, jam mulai-selesai, icon, warna) |
| `activity_photos` | URL + object key foto (file fisik ada di R2) |
| `admin_trip_overview` (view) | Ringkasan semua trip untuk dashboard admin, pakai `security_invoker = on` |

**Catatan penting keamanan:**
- RLS aktif di semua tabel, tapi diblokir total dari `anon` key.
- Backend **wajib** connect ke Supabase pakai `service_role` key (bypass RLS). Semua validasi otorisasi (siapa boleh akses trip apa) **harus** divalidasi di layer Express, bukan mengandalkan RLS Supabase.
- View `admin_trip_overview` pakai `security_invoker = on` sebagai defense-in-depth kalau suatu saat anon/authenticated key ikut dipakai.

---

## 6. Package yang Digunakan & Fungsinya

### Frontend (`frontend/package.json`)

| Package | Fungsi |
|---|---|
| `react`, `react-dom` | Core UI library |
| `react-router-dom` | Routing SPA |
| `axios` | HTTP client ke backend API (dengan `withCredentials: true` untuk cookie) |
| `zustand` | State management ringan (misal: authStore) |
| `@tanstack/react-query` | Data fetching, caching, sinkronisasi state server |
| `react-hook-form` | Form handling |
| `zod` | Schema validation (dipakai bareng react-hook-form via resolver) |
| `@hookform/resolvers` | Jembatan zod ↔ react-hook-form |
| `lucide-react` | Icon library, dipakai konsisten di seluruh UI termasuk icon kegiatan |
| `tailwindcss` + `@tailwindcss/vite` | Styling utility-first (v4, config via CSS `@theme`, tanpa `tailwind.config.js`) |
| `framer-motion` *(perlu ditambahkan)* | Animasi untuk timeline kreatif |
| `jspdf` + `html2canvas` *(perlu ditambahkan)* | Export tampilan timeline ke PDF |

### Backend (`backend/package.json`)

| Package | Fungsi |
|---|---|
| `express` | Web framework |
| `cors` | Handle CORS, wajib `credentials: true` karena pakai cookie |
| `cookie-parser` | Parsing httpOnly cookie dari request |
| `dotenv` | Load environment variables |
| `jsonwebtoken` | Sign & verify JWT (access + refresh token) |
| `bcrypt` | Hash password |
| `zod` | Validasi request body/query/params |
| `@supabase/supabase-js` | Client untuk koneksi ke Supabase (pakai `service_role` key) |
| `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` | Upload/delete/presigned URL ke Cloudflare R2 (S3-compatible) |
| `multer` | Handle multipart/form-data untuk upload foto |
| `express-rate-limit` | Rate limiting endpoint (khususnya auth) |
| `swagger-jsdoc` + `swagger-ui-express` | Generate & serve dokumentasi API di `/api-docs` |

---

## 7. Environment Variables

### `backend/.env`
```
PORT=5000
NODE_ENV=development

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=          # URL publik (r2.dev subdomain atau custom domain), BUKAN endpoint S3 API

CLIENT_URL=http://localhost:5173
API_BASE_URL=http://localhost:5000/api
```

### `frontend/.env`
```
VITE_API_URL=http://localhost:5000/api
```

**Catatan:** `.env` tidak boleh pernah di-commit ke Git — sudah masuk `.gitignore` di root.

---

## 8. Keputusan Teknis yang Sudah Diambil

- **Auth:** JWT dual-token via httpOnly cookie (bukan Supabase Auth, bukan localStorage token).
- **Styling:** Tailwind v4 — tidak pakai `postcss.config.js`/`tailwind.config.js`, kustomisasi tema lewat `@theme` di CSS.
- **R2 API Token:** gunakan **Account API Token** (bukan User API Token), supaya tidak terikat ke akun personal dan tetap aktif meski ada perubahan anggota tim.
- **R2 Public URL vs Endpoint:** `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` adalah endpoint SDK (privat, butuh signature). URL publik terpisah, didapat dari mengaktifkan `r2.dev` subdomain atau custom domain di bucket settings.
- **Deploy:** disarankan mulai dari Render (free tier untuk MVP, region Singapore), upgrade ke paid plan begitu siap production.

---

## 9. Yang Belum Dikerjakan / Next Steps

Prinsip pengerjaan: **backend-first**. Seluruh REST API + dokumentasi Swagger diselesaikan dan diuji tuntas dulu sampai bisa dipanggil end-to-end lewat Postman/Thunder Client, sebelum satu baris pun kode frontend fitur ditulis. Ini supaya kontrak API (request/response shape, status code, error format) sudah stabil sebelum frontend mulai bergantung padanya, dan supaya seluruh business logic (validasi, kalkulasi, aturan akses) terpusat di backend — frontend nantinya murni consumer/presentation layer.

**Fase Backend (REST API + Swagger):**
- [ ] Setup dasar: `app.ts`, `server.ts`, `config/env.ts` (validasi env vars pakai zod), `config/cors.ts`, `config/swagger.ts`
- [ ] Middleware dasar: `errorHandler`, `asyncHandler`, `validate` (generic zod validator)
- [ ] Module `auth`: register, login, refresh, logout — set/clear httpOnly cookie, hash password (bcrypt), sign/verify JWT dual-token
- [ ] Middleware `authGuard` (verifikasi access token dari cookie) & `adminGuard` (cek role admin)
- [ ] Module `users` — CRUD dasar untuk kebutuhan admin & pencarian user (untuk fitur tambah anggota trip)
- [ ] Module `trips` — CRUD trip, validasi kepemilikan (hanya owner yang boleh edit/hapus)
- [ ] Module `trip-members` — tambah/hapus anggota trip via username/UUID, validasi hanya owner yang boleh mengelola anggota
- [ ] Module `activities` — CRUD kegiatan, validasi `activity_date` harus dalam rentang `start_date`-`end_date` trip, validasi `end_time > start_time`, validasi hanya member trip yang boleh akses
- [ ] Module `activity-photos` — upload ke R2 (`multer` + `@aws-sdk/client-s3`), simpan URL & key, hapus file R2 saat activity/foto dihapus
- [ ] Module `admin` — endpoint kelola user & lihat semua trip (`admin_trip_overview`), dilindungi `adminGuard`
- [ ] `express-rate-limit` diterapkan minimal di endpoint auth (login/register)
- [ ] Dokumentasi Swagger (`@swagger` JSDoc) ditulis **bersamaan** dengan tiap module — bukan belakangan, supaya tidak ada endpoint yang terlewat
- [ ] Uji seluruh endpoint end-to-end via Postman/Thunder Client (termasuk skenario gagal: unauthorized, forbidden, validasi error) sebelum lanjut ke frontend
- [ ] Review ulang seluruh response shape API — pastikan konsisten (misal format `{ success, data, error }`) karena ini akan jadi kontrak tetap untuk frontend

**Fase Frontend (setelah backend & Swagger selesai):**
- [ ] `lib/axios.ts` — instance axios dengan `withCredentials: true`, interceptor untuk auto-refresh token saat 401
- [ ] Frontend auth flow (login/register form → redirect dashboard, `authStore` via zustand) — **tanpa duplikasi validasi bisnis**, cukup validasi format input (required, format email, dll) via zod di form; validasi bisnis (misal "email sudah terdaftar") tetap bersumber dari response backend
- [ ] Module `trips` (UI) — form create/edit hanya kirim data mentah ke API, tidak menghitung apapun di client
- [ ] Module `trip-members` (UI)
- [ ] Module `activities` (UI) + upload foto — validasi rentang tanggal/jam di frontend hanya untuk UX (feedback instan), keputusan final tetap dari response backend
- [ ] Komponen `timeline/` — visualisasi kreatif, murni presentational berdasarkan data dari API (pertimbangkan framer-motion untuk animasi)
- [ ] Fitur `export-pdf/`
- [ ] Module `admin` (UI)
- [ ] Setup deployment (backend ke Render, frontend ke platform pilihan)

---

## 10. Urutan Pengerjaan yang Disarankan

### Tahap 1 — Backend Foundation
1. Setup `app.ts`, `server.ts`, `env.ts`, `cors.ts`, `swagger.ts`, dan seluruh middleware dasar.
2. Module `auth` lengkap (register/login/refresh/logout) sampai cookie ter-set dan ter-verifikasi dengan benar.
3. Test auth via Postman/Thunder Client (bukan Swagger UI, karena Swagger UI kurang cocok untuk testing cookie flow lintas origin).

### Tahap 2 — Backend Domain Modules
4. Module `users` → `trips` → `trip-members` → `activities` → `activity-photos` → `admin`, satu per satu, **setiap module langsung dilengkapi dokumentasi Swagger sebelum pindah ke module berikutnya**.
5. Setiap module diuji end-to-end (happy path + edge case) sebelum dianggap selesai.

### Tahap 3 — Backend Freeze & Review
6. Setelah semua module selesai, review ulang keseluruhan API lewat `/api-docs` — pastikan tidak ada endpoint yang terlewat dokumentasi, response shape konsisten antar module.
7. Titik ini jadi "kontrak API" yang stabil — perubahan besar pada shape request/response setelah tahap ini sebaiknya dihindari kecuali benar-benar perlu.

### Tahap 4 — Frontend (Consumer Layer)
8. Setup `lib/axios.ts` + `authStore` (zustand) + routing dasar.
9. Frontend auth flow (login form → redirect dashboard).
10. Module `trips` → `trip-members` → `activities` → `activity-photos`, mengikuti urutan yang sama dengan backend, tiap module frontend langsung terhubung ke endpoint yang sudah stabil dari Tahap 1-3.
11. Komponen `timeline/` untuk visualisasi.
12. Fitur `export-pdf/` (paling akhir karena bergantung pada semua data di atas).
13. Module `admin` (UI) paralel kapan saja setelah auth & trips selesai.

**Aturan yang dipegang mulai Tahap 4:** kalau ada kebutuhan logic baru saat mengerjakan frontend (misal aturan validasi baru, kalkulasi, atau pengecekan akses), logic tersebut **ditambahkan ke backend terlebih dahulu** (service/validation layer + update Swagger), baru frontend memanggil endpoint yang sudah diperbarui. Frontend tidak boleh menyimpan business logic sendiri di luar keperluan UX (loading state, optimistic UI, format tampilan).
