# Shared UI & Layout Components

Folder ini menyimpan komponen UI dan layout generik yang reusable lintas fitur aplikasi Itinerary Generator.

## Komponen yang Tersedia

- **`ui/PencilBorder.tsx`**: Wrapper SVG `roughjs` untuk merender border pensil bergaya coretan tangan.
- **`ui/PencilDivider.tsx`**: Pembatas horizontal bergelombang tipis dengan efek SVG noise turbulence.
- **`ui/Button.tsx`**: Tombol dengan varian warna (`primary`, `secondary`, `outline`, `danger`), micro-animations Framer Motion, dan target sentuh mobile-first.
- **`ui/Input.tsx`**: Input form hand-drawn dengan label Poppins dan animasi error.
- **`layout/Navbar.tsx`**: Header navigasi aplikasi dengan logo Cabin Sketch, profil avatar user, dan tombol logout.
- **`layout/PageTransition.tsx`**: Wrapper `motion.div` untuk transisi pergantian halaman SPA.
