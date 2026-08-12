# Modul Frontend: Users (Admin User Management)

Modul ini mengelola antarmuka CRUD manajemen pengguna khusus untuk Administrator (melihat daftar user, menambah user baru, mengedit profil/role/password, dan menghapus user).

## Struktur Modul

```
src/features/users/
├── components/        # UI murni (UserTable.tsx, UserFormModal.tsx)
├── hooks/             # Logic & React Query mutations (useUsers.ts)
├── services/          # Pure API client calls ke /api/admin/users (usersService.ts)
├── types/             # TypeScript interfaces & Zod schemas (users.types.ts)
├── index.ts           # Barrel export
└── README.md          # Dokumentasi modul
```

## Fitur Utama

- **UserTable**: Tabel/kartu daftar pengguna responsive dengan filter role, status aktif, dan tombol aksi.
- **UserFormModal**: Modal form tambah & edit pengguna.
