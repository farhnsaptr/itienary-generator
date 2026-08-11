# Modul Activities

Modul ini mengelola kegiatan-kegiatan perjalanan dalam sebuah trip.

## Fitur & Validasi Utama

- **Validasi Rentang Tanggal**: `activity_date` harus berada di antara `start_date` dan `end_date` milik trip.
- **Validasi Jam**: `end_time` harus lebih besar dari `start_time`.
- **Integrasi Cloudflare R2**: Saat kegiatan dihapus, foto-foto kegiatan terkait pada R2 otomatis dibersihkan.

## Endpoints

| Method | Endpoint | Auth Required | Deskripsi |
|---|---|---|---|
| GET | `/api/trips/:tripId/activities` | ✅ | Lihat semua kegiatan trip (opsional `?date=YYYY-MM-DD`) |
| POST | `/api/trips/:tripId/activities` | ✅ | Tambah kegiatan baru dalam trip |
| GET | `/api/activities/:id` | ✅ | Detail kegiatan |
| PUT | `/api/activities/:id` | ✅ | Update kegiatan |
| DELETE | `/api/activities/:id` | ✅ | Hapus kegiatan (+ cleanup R2) |
