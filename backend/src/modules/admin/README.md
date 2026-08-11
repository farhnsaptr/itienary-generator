# Modul Admin

Modul khusus administrator aplikasi untuk mengelola status akun pengguna dan memantau statistik seluruh trip di dalam sistem.

## Hak Akses

Seluruh endpoint pada modul ini dilindungi oleh dua middleware:
1. `authGuard`: Memastikan token autentikasi valid.
2. `adminGuard`: Memastikan `role` user yang terautentikasi adalah `admin`.

## Endpoints

| Method | Endpoint | Auth Required | Role Required | Deskripsi |
|---|---|---|---|---|
| GET | `/api/admin/users` | ✅ | Admin | Daftar seluruh pengguna dengan fitur pencarian & pagination |
| PATCH | `/api/admin/users/:id/status` | ✅ | Admin | Mengubah status aktif / role pengguna |
| GET | `/api/admin/trips` | ✅ | Admin | Ringkasan seluruh trip dari view `admin_trip_overview` |
