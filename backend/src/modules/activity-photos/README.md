# Modul Activity Photos

Modul ini bertanggung jawab mengelola pengunggahan foto kegiatan ke Cloudflare R2 dan penyimpanan referensi URL + key ke database PostgreSQL Supabase.

## Fitur Utama

- **Storage R2**: Mengunggah file fisik langsung ke Cloudflare R2 bucket.
- **Pembersihan Otomatis**: Menghapus objek fisik dari R2 saat record foto dihapus dari database.

## Endpoints

| Method | Endpoint | Auth Required | Deskripsi |
|---|---|---|---|
| GET | `/api/activities/:activityId/photos` | ✅ | Lihat foto-foto kegiatan |
| POST | `/api/activities/:activityId/photos` | ✅ | Upload foto baru (multipart/form-data) |
| DELETE | `/api/photos/:id` | ✅ | Hapus foto dari DB dan R2 |
