# Modul Users

Modul ini bertanggung jawab untuk pencarian pengguna (digunakan saat mengundang anggota ke trip) dan pembaruan profil pengguna.

## Endpoints

| Method | Endpoint | Auth Required | Deskripsi |
|---|---|---|---|
| GET | `/api/users/search?q=...` | ✅ | Cari pengguna lain berdasarkan username/email |
| PUT | `/api/users/profile` | ✅ | Update nama lengkap dan avatar URL |
