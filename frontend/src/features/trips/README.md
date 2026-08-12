# Modul Frontend: Trips

Modul ini mengelola tampilan dan manajemen perjalanan (Trip) pada halaman utama (Dashboard), termasuk render daftar trip bergaya scrapbook teranimasi dan modal pembuatan trip baru.

## Struktur Modul

```
src/features/trips/
├── components/        # UI murni (TripCard.tsx, CreateTripModal.tsx)
├── hooks/             # Logic & React Query state management (useTrips.ts)
├── services/          # Pure API client calls (tripsService.ts)
├── types/             # TypeScript interfaces & Zod schema (trips.types.ts)
├── index.ts           # Barrel export
└── README.md          # Dokumentasi modul
```

## Fitur Utama

- **TripCard**: Kartu trip dengan border pensil `roughjs`, warna pastel berselang-seling, rotasi asimetris, dan animasi *staggered list entry* via `framer-motion`.
- **CreateTripModal**: Form modal pembuatan trip baru lengkap dengan pilihan warna tema.
