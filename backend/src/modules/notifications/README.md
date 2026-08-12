# Modul Backend: Notifications

Modul ini menangani pengiriman dan pengelolaan notifikasi pengguna, khususnya untuk respon undangan *Trip Invitation* (`accepted` / `rejected`).

## Endpoints

- `GET /api/notifications`: Mengambil daftar notifikasi pengguna yang sedang login.
- `PATCH /api/notifications/:id/respond`: Merespon undangan trip (`accepted` atau `rejected`).
