# Modul Trips

Modul ini mengelola data perjalanan (Trip) seperti nama trip, deskripsi, tanggal mulai/selesai, warna tema, dan cover image.

## Fitur Utama

- **Otomatisasi Owner**: Pembuat trip otomatis ditambahkan sebagai `owner` pada tabel `trip_members`.
- **Integrasi Cloudflare R2**: Upload dan delete file cover image trip dilakukan ke Cloudflare R2.
- **Batasan Akses**: Hanya pengguna yang terdaftar sebagai member/owner yang dapat membaca trip, dan hanya `owner` yang dapat memperbarui/menghapus trip.

## Endpoints

| Method | Endpoint | Auth Required | Role Required | Deskripsi |
|---|---|---|---|---|
| GET | `/api/trips` | ✅ | Any Member | Daftar trip pengguna |
| POST | `/api/trips` | ✅ | Any User | Buat trip baru (+ cover image opsional) |
| GET | `/api/trips/:id` | ✅ | Any Member | Detail trip |
| PUT | `/api/trips/:id` | ✅ | Owner | Update trip |
| DELETE | `/api/trips/:id` | ✅ | Owner | Hapus trip (+ cleanup R2) |
