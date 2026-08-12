# AGENTS.md

Dokumen ini berisi preferensi dan aturan coding yang harus diikuti oleh siapa pun (atau AI agent apa pun) yang berkontribusi pada codebase ini. Tujuannya agar struktur project tetap konsisten, modular, dan mudah dirawat dalam jangka panjang.

## 1. Prinsip Modularitas

- Sistem harus dikembangkan secara **modular**, bukan monolitik.
- Setiap fitur/domain harus punya folder sendiri yang self-contained (komponen, logic, service, types, dsb berada dalam satu modul).
- Hindari file besar yang menangani banyak tanggung jawab sekaligus (God Component / God Service). Jika sebuah file mulai menangani lebih dari satu concern, pecah menjadi beberapa file/module.
- Modul harus punya boundary yang jelas — hindari dependency menyilang yang tidak perlu antar modul yang tidak berkaitan.

## 2. Pemisahan Tampilan (UI) dan Logika — React Native

- Untuk aplikasi React Native, **tampilan (UI) dan logika harus dipisah secara tegas**.
- Pola yang digunakan:
  - **Komponen UI** (`*.tsx` di folder `components/` atau `screens/`) → hanya bertanggung jawab merender tampilan, menerima data dan callback lewat props.
  - **Logika/state/business rule** → dipisah ke custom hooks (`useXxx.ts`), services, atau store (misal Zustand/Redux), bukan ditulis langsung di dalam komponen.
- Hindari menulis fetch/API call, kalkulasi bisnis, atau manipulasi state kompleks langsung di dalam file komponen.
- Contoh struktur yang disarankan:
  ```
  features/
    order/
      components/       # UI murni
      hooks/             # logic & state
      services/          # API calls
      types/              # type definitions
      index.ts
  ```

## 3. Komponen Reusable, Bukan Halaman Statis

- Dilarang membuat halaman sebagai kumpulan elemen statis yang ditulis ulang di setiap screen.
- Sebelum membangun sebuah halaman, **buat dulu komponen dasar yang reusable**, seperti:
  - Button (dengan variant: primary, secondary, danger, dll)
  - Navbar / Header
  - Card, ListItem, Input, Modal, Badge, dsb.
- Komponen reusable ini diletakkan di folder `components/` (shared/global) dan digunakan ulang di berbagai screen/fitur.
- Halaman (screen) sebaiknya lebih banyak berupa **komposisi** dari komponen-komponen kecil, bukan markup yang ditulis dari nol setiap kali.

## 4. Dokumentasi README per Folder/App

- Setiap folder modul dan setiap app dalam monorepo **wajib memiliki `README.md`**.
- README minimal berisi:
  - Deskripsi singkat fungsi folder/app tersebut
  - Struktur folder (jika relevan)
  - Cara menjalankan/menggunakan (khusus untuk app)
  - Daftar fitur utama
- **Aturan update README:**
  - ✅ Ada penambahan fitur baru → README **wajib** diupdate (deskripsi fitur, struktur baru jika ada, dsb).
  - ❌ Hanya fix bug/patch kecil → README **tidak perlu** diupdate.

## 5. Mobile-First Development

- Setiap komponen/halaman **wajib didesain dan dikembangkan untuk tampilan mobile terlebih dahulu**, baru kemudian disesuaikan/di-extend untuk tablet dan desktop.
- Urutan kerja saat membangun UI:
  1. Buat/uji layout dalam viewport mobile (± 375px) sampai benar-benar rapi dan fungsional.
  2. Setelah versi mobile selesai, tambahkan breakpoint yang lebih besar (`sm:`, `md:`, `lg:`, dst di Tailwind) untuk menyesuaikan tampilan di layar lebih lebar.
  3. Jangan membangun versi desktop dulu lalu "mengecilkan" lewat media query — ini sering menghasilkan elemen yang terpotong, teks kepanjangan, atau tombol yang sulit di-tap di layar kecil.
- Elemen interaktif (tombol, input, item list, navigasi) harus punya target sentuh yang cukup besar untuk mobile (minimal ~44x44px area tap), bukan disesuaikan belakangan.
- Komponen reusable (lihat bagian 3) harus divalidasi dulu tampilannya di ukuran mobile sebelum dipakai berulang di berbagai halaman.
- Fitur yang secara alami berat di layar kecil (misal timeline, tabel data, modal kompleks) harus punya rencana adaptasi mobile yang jelas sejak awal desain — bukan ditambal belakangan setelah versi desktop jadi.
- Testing manual/responsif wajib dicek minimal di breakpoint mobile sebelum sebuah fitur dianggap selesai, meskipun target akhir pengguna juga mengakses lewat desktop.

## 6. Tidak Boleh Hardcode — Data Harus Dinamis dan Bersumber

- Dilarang menulis nilai statis (hardcoded) untuk data yang seharusnya berasal dari sumber data (API, database, config, environment variable, dsb).
- Termasuk yang tidak boleh di-hardcode:
  - Data bisnis (nama part, kode mesin, daftar user, status, dsb) → harus diambil dari database/API.
  - URL endpoint, kredensial, port, path → wajib lewat file konfigurasi/environment variable (`.env`, `config/`), bukan ditulis langsung di kode.
  - Label/teks yang bergantung pada data dinamis (misal daftar role, daftar shift, daftar leader) → ambil dari service/API, jangan ditulis manual sebagai array/object statis di komponen.
  - Nilai magic number/string yang punya makna bisnis → pindahkan ke constants file atau ambil dari sumber data, beri nama yang jelas.
- Yang **masih boleh** dianggap konstanta (bukan kategori "hardcode" di atas): nilai teknis yang memang tetap secara definisi (misal ukuran padding UI, breakpoint layout, warna tema) — ini boleh disimpan di file constants/theme, bukan berarti harus dari API.
- Jika data belum tersedia dari backend, buat dulu service/hook dengan interface yang jelas (bisa pakai mock sementara), agar saat data asli tersedia tinggal diganti sumbernya tanpa mengubah struktur kode di komponen.

## 7. Larangan Penggunaan Emoji Default

- **Dilarang menggunakan emoji default Unicode** (seperti 🚀, ✨, ✈️, 🏖️, 👋, 🗺️, 🧪, ✅, ❌, dll) di dalam kode frontend, backend, maupun UI antarmuka.
- Untuk elemen visual / ikon pada UI frontend, **selalu gunakan ikon SVG / Lucide Icons** (`lucide-react`) atau penataan gaya tipografi yang bersih.
- Untuk log/output terminal dan dokumentasi, gunakan teks polos atau simbol terstandar tanpa emoji default.

## Ringkasan Cepat

| Aturan | Wajib? |
|---|---|
| Struktur modular per fitur | ✅ |
| Pisah UI dan logic (RN) | ✅ |
| Komponen reusable sebelum halaman statis | ✅ |
| Develop tampilan mobile terlebih dahulu (mobile-first) | ✅ |
| README.md di setiap folder/app | ✅ |
| Update README saat fitur baru | ✅ |
| Update README saat fix bug | ❌ |
| Data bisnis/konfigurasi hardcode langsung di kode | ❌ |
| Data diambil dinamis dari API/DB/config | ✅ |
| Dilarang menggunakan emoji default Unicode | ✅ |

