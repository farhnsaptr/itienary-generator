# Modul Trip Members

Modul ini menangani pengundangan dan penghapusan anggota perjalanan (Trip Members).

## Fitur Utama

- **Pencarian & Penambahan**: Owner dapat menambahkan anggota baru berdasarkan `username`, `email`, atau `user_id`.
- **Proteksi Owner**: Owner trip tidak dapat dikeluarkan dari trip.
- **Keluar Mandiri**: Anggota dapat memilih untuk keluar dari trip mandiri (leave trip).

## Endpoints

| Method | Endpoint | Auth Required | Role Required | Deskripsi |
|---|---|---|---|---|
| GET | `/api/trips/:tripId/members` | ✅ | Member/Owner | Lihat daftar anggota trip |
| POST | `/api/trips/:tripId/members` | ✅ | Owner | Tambah anggota trip |
| DELETE | `/api/trips/:tripId/members/:targetUserId` | ✅ | Owner / Self | Keluarkan anggota / Keluar trip |
