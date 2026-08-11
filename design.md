# Design System: Itinerary Generator

> Arahan desain untuk siapapun (developer/AI agent) yang mengerjakan UI project ini. Style ini **wajib** diikuti di seluruh komponen — jangan kembali ke default Tailwind (border tegas, shadow flat, sudut siku) tanpa alasan kuat.

---

## 1. Mood & Arah Desain

**Playful, hangat, terasa dibuat tangan** — seperti buku itinerary yang dicorat-coret pakai crayon dan pensil warna oleh anak yang lagi excited liburan. Bukan travel-app korporat yang steril. Referensi rasa: halaman scrapbook, papan mading kelas, buku gambar anak SD, bukan dashboard SaaS.

**Signature element:** setiap border di aplikasi ini — kartu, modal, garis pembatas, input — digambar sebagai **goresan pensil yang sedikit tidak sempurna** (garis bergetar, sudut tidak simetris, kadang keluar sedikit dari garis), bukan garis CSS lurus standar. Ini elemen yang membuat aplikasi ini tidak bisa disamakan dengan travel-app lain manapun.

---

## 2. Design Tokens

### 2.1 Warna

| Token | Hex | Peran |
|---|---|---|
| `--color-pink` | `#FFB3C6` | Primary — aksen utama, tombol utama, highlight kegiatan |
| `--color-blue` | `#A2D2FF` | Secondary — aksen kedua, kartu kegiatan alternate, link |
| `--color-cream` | `#FFF8F0` | Background dasar — warna kertas gambar, hangat bukan putih steril |
| `--color-crayon-yellow` | `#FFD97D` | Aksen tersier — highlight, badge, tanggal aktif |
| `--color-crayon-mint` | `#B5EAD7` | Aksen tersier — status sukses, tag kategori kegiatan outdoor |
| `--color-ink` | `#3A3238` | Warna teks utama & garis pensil — bukan hitam pekat (#000), lebih seperti tinta pensil 2B |
| `--color-ink-soft` | `#7A7178` | Teks sekunder, caption, placeholder |

**Aturan pemakaian:** pink dan biru adalah dua warna dominan yang harus selalu terlihat berdampingan di setiap layar utama (mis. gradient lembut di background, atau kartu bergantian pink/biru di timeline). Warna crayon lain (`yellow`, `mint`) dipakai sebagai aksen sekunder — jangan sampai kompetisi dengan pink/biru sebagai warna utama.

### 2.2 Tipografi

| Role | Font | Google Fonts import |
|---|---|---|
| Primary / Display | **Cabin Sketch** | `Cabin+Sketch:wght@400;700` |
| Secondary / Body | **Poppins** | `Poppins:wght@300;400;500;600;700` |

**Aturan pakai:**
- **Cabin Sketch** khusus untuk: judul halaman, nama trip, judul modal, label besar, angka/jam di timeline, logo. Ukuran minimal 18px — font ini kehilangan karakter dan sulit dibaca di ukuran kecil.
- **Poppins** untuk: body text, deskripsi kegiatan, form label, tombol, navigasi, caption. Ini font yang dibaca dalam jumlah banyak, jadi tidak boleh pakai Cabin Sketch di sini.
- **Jangan** pakai Cabin Sketch untuk paragraf panjang atau teks di bawah 16px — legibility-nya rendah karena karakternya yang sengaja "coret-coretan".

**Skala tipografi:**

```
Display (Cabin Sketch, weight 700)
  h1: 40px / mobile 28px   — nama trip, judul halaman utama
  h2: 28px / mobile 22px   — judul section ("Hari 1", "Timeline")
  h3: 20px / mobile 18px   — judul kartu kegiatan, judul modal

Body (Poppins)
  body-lg: 16px / weight 400   — deskripsi kegiatan
  body: 14px / weight 400      — teks umum, form
  caption: 12px / weight 500   — timestamp, label kecil, badge
  button: 14px / weight 600    — teks tombol
```

### 2.3 Radius & Spacing

- Radius dasar: **16px–24px** pada kartu dan modal (bukan sudut siku, bukan pula full-rounded/pill kecuali tombol icon). Kesan "digunting agak asal" — boleh pakai radius asimetris (mis. `border-radius: 18px 22px 16px 24px`) untuk kartu kegiatan supaya makin terasa hand-drawn.
- Spacing pakai skala 4px (`4, 8, 12, 16, 24, 32, 48, 64`) — standar Tailwind, tidak perlu diubah. Yang membuat playful bukan spacing-nya, tapi border & texture-nya.

### 2.4 Shadow

Hindari `box-shadow` flat/tegas ala Material Design. Pakai shadow lembut dengan tint warna kartu itu sendiri, bukan hitam:

```css
/* kartu pink */
box-shadow: 4px 6px 0px 0px rgba(255, 179, 198, 0.4);
/* kartu biru */
box-shadow: 4px 6px 0px 0px rgba(162, 210, 255, 0.4);
```

Offset shadow solid tanpa blur (`0px blur`) memberi kesan "kartu ditempel dengan sedikit miring", seperti elemen scrapbook — bukan shadow realistis.

---

## 3. Signature Element: Goresan Pensil & Crayon

Ini bagian paling penting — CSS `border` biasa **tidak bisa** menghasilkan garis pensil yang bergetar/tidak presisi. Berikut 2 pendekatan, pilih sesuai kebutuhan komponen:

### 3.1 Pendekatan A — Rough.js (disarankan untuk card, modal, divider, input)

[Rough.js](https://roughjs.com) adalah library yang menggambar bentuk SVG/Canvas dengan gaya hand-drawn (dipakai juga oleh Excalidraw). Cocok karena border yang dihasilkan benar-benar unik tiap render (ada `seed` untuk konsistensi) dan bisa mengikuti bentuk kotak/rounded-rect apapun.

```bash
npm install roughjs
```

Contoh komponen wrapper `PencilBorder.tsx`:

```tsx
import { useEffect, useRef } from "react";
import rough from "roughjs";

interface PencilBorderProps {
  width: number;
  height: number;
  color?: string;     // warna garis, default var(--color-ink)
  radius?: number;
  seed?: number;       // fix seed supaya border tidak "berubah-ubah" tiap re-render
}

export function PencilBorder({ width, height, color = "#3A3238", radius = 20, seed = 1 }: PencilBorderProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    svgRef.current.innerHTML = "";
    const rc = rough.svg(svgRef.current);
    const node = rc.rectangle(2, 2, width - 4, height - 4, {
      roughness: 1.8,       // makin tinggi makin "berantakan"
      bowing: 2,            // lengkungan garis
      stroke: color,
      strokeWidth: 2.5,
      fill: "none",
      seed,
    });
    svgRef.current.appendChild(node);
  }, [width, height, color, radius, seed]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="absolute inset-0 pointer-events-none"
      style={{ borderRadius: radius }}
    />
  );
}
```

Dipakai sebagai layer absolute di atas card:

```tsx
<div className="relative p-5 bg-[var(--color-pink)]/20 rounded-[20px]">
  <PencilBorder width={320} height={180} color="var(--color-ink)" seed={4} />
  {/* konten kartu */}
</div>
```

**Kapan pakai Rough.js:** kartu kegiatan (timeline), modal, card trip, garis divider antar section, outline input/textarea saat focus.

### 3.2 Pendekatan B — SVG Filter Turbulence (untuk garis pembatas sederhana / underline)

Untuk elemen yang lebih simpel (garis pembatas horizontal, underline judul, garis bawah tab aktif), pakai SVG filter `feTurbulence` + `feDisplacementMap` yang di-apply lewat CSS `filter`, lebih ringan daripada render Rough.js:

```html
<svg width="0" height="0">
  <filter id="pencil-wobble">
    <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="noise" seed="3" />
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
  </filter>
</svg>
```

```css
.divider-pencil {
  border: none;
  border-top: 3px solid var(--color-ink);
  filter: url(#pencil-wobble);
}
```

**Kapan pakai:** divider tipis, underline, garis bawah pada tab navigasi, garis penghubung antar kartu di timeline.

### 3.3 Background — Coretan Crayon

Background utama (`body`/halaman dashboard) memakai **layer tekstur crayon**, bukan warna solid flat:

1. **Base layer:** `var(--color-cream)` sebagai warna dasar.
2. **Texture layer:** SVG noise/scribble tipis (opacity 4–8%) di-tile sebagai `background-image`, memberi kesan kertas gambar bertekstur — generate sekali sebagai asset SVG statis (`crayon-texture.svg`), jangan generate ulang tiap render (mahal secara performa).
3. **Accent scribbles:** 3–5 coretan crayon besar (bentuk lengkung bebas, warna pink/biru/kuning dengan opacity 15–25%) diletakkan di sudut-sudut halaman (posisi `fixed`/`absolute`, `z-index` di bawah konten) — bukan pattern berulang, tapi elemen dekoratif yang disusun manual supaya terasa "digambar dengan sengaja", bukan pattern generatif yang terasa robotic.

Contoh struktur CSS:

```css
body {
  background-color: var(--color-cream);
  background-image: url("/textures/crayon-texture.svg");
  background-repeat: repeat;
  background-size: 400px 400px;
}
```

Scribble aksen ditaruh sebagai elemen dekoratif di layout (bukan bagian dari `body` CSS), supaya bisa berbeda per halaman (misal scribble bentuk pesawat kertas di halaman trip, scribble bentuk matahari di dashboard).

---

## 4. Setup Tailwind v4 (`@theme`)

Karena project ini pakai Tailwind v4, semua token warna & font didefinisikan langsung di file CSS, bukan `tailwind.config.js`:

```css
/* src/styles/globals.css */
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Cabin+Sketch:wght@400;700&family=Poppins:wght@300;400;500;600;700&display=swap');

@theme {
  --color-pink: #FFB3C6;
  --color-blue: #A2D2FF;
  --color-cream: #FFF8F0;
  --color-crayon-yellow: #FFD97D;
  --color-crayon-mint: #B5EAD7;
  --color-ink: #3A3238;
  --color-ink-soft: #7A7178;

  --font-display: "Cabin Sketch", cursive;
  --font-body: "Poppins", sans-serif;

  --radius-card: 20px;
  --radius-modal: 24px;
}

body {
  font-family: var(--font-body);
  color: var(--color-ink);
  background-color: var(--color-cream);
}

h1, h2, h3, .font-display {
  font-family: var(--font-display);
}
```

Class yang otomatis tersedia setelah ini: `bg-pink`, `bg-blue`, `text-ink`, `font-display`, `rounded-card`, dst.

---

## 5. Spesifikasi Komponen

### 5.1 Card (kartu trip / kartu kegiatan timeline)
- Background: pink atau biru pastel dengan opacity 15–20% di atas cream, **bergantian** antar kartu (kartu ganjil pink, genap biru — atau random per kegiatan dengan warna dari field `color` di tabel `activities`).
- Border: Rough.js pencil border (lihat 3.1), `roughness: 1.5–2`.
- Radius: asimetris ringan, contoh `18px 22px 16px 24px`.
- Shadow: offset solid sesuai 2.4.
- Rotasi ringan opsional: `rotate(-1deg)` atau `rotate(1deg)` berselang-seling antar kartu untuk kesan "ditempel manual di papan".
- Judul kartu: Cabin Sketch 20px. Isi: Poppins 14px.

### 5.2 Modal
- Border: Rough.js dengan `strokeWidth` lebih tebal (3px) supaya terasa seperti bingkai gambar tangan.
- Overlay backdrop: `var(--color-ink)` opacity 40%, bukan hitam pekat.
- Radius: 24px.
- Header modal pakai font display, tombol close (`X` dari lucide-react) digambar dengan sedikit rotasi custom, bukan icon lurus standar.

### 5.3 Divider / Garis Pembatas
- Pakai pendekatan SVG filter turbulence (3.2), warna `var(--color-ink)` opacity 60%, tebal 2–3px.
- Dipakai antar section timeline per hari, dan sebagai pemisah header/konten di modal.

### 5.4 Input & Form
- Border default: pencil border tipis (roughness rendah, ~1.0) warna `--color-ink-soft`.
- Saat fokus: border berubah warna jadi `--color-pink` atau `--color-blue`, roughness sedikit naik (efek "digaris ulang lebih tegas").
- Label: Poppins 12px weight 500, di atas input (bukan floating label — lebih sesuai gaya buku catatan).

### 5.5 Tombol
- Primary: background `--color-pink`, border pencil `--color-ink`, teks Poppins 600 warna ink.
- Secondary: background `--color-blue`, sama treatment.
- Hover: sedikit `rotate` + `translateY(-2px)`, seperti kartu terangkat dari kertas.
- Icon: lucide-react, `strokeWidth={2.5}` (lebih tebal dari default 2) supaya senada dengan garis pensil tebal di sekitarnya.

### 5.6 Timeline (komponen inti aplikasi)
- Garis waktu vertikal/horizontal utama: dibuat dengan SVG path melengkung bebas (bukan garis lurus), memakai warna gradient pink→biru mengikuti urutan waktu.
- Titik/marker jam: bentuk seperti "ditusuk pin", pakai crayon-yellow sebagai warna dot.
- Kartu kegiatan menempel di sisi garis, mengikuti spesifikasi 5.1, dengan foto kegiatan (jika ada) ditampilkan sebagai polaroid kecil — rotasi ringan + border putih tebal 6-8px sebelum pencil border, meniru foto yang ditempel di scrapbook.
- Icon kegiatan (lucide-react) muncul sebagai badge bulat kecil di pojok kartu, background sesuai warna kartu.

### 5.7 Export PDF
- Layout PDF tetap mempertahankan tema (background cream + texture ringan, font Cabin Sketch untuk judul, Poppins untuk isi) — bukan versi "polos" hitam-putih. Rough.js tidak bisa langsung dipakai saat render PDF (karena butuh DOM), jadi untuk export gunakan **snapshot border SVG statis** (generate sekali dengan seed tetap, simpan sebagai elemen yang di-capture `html2canvas`) supaya hasil PDF konsisten dengan tampilan web.

---

## 6. Prinsip Restraint (Jangan Berlebihan)

- **Satu elemen boleh sangat playful, sekitarnya harus tenang.** Jangan semua elemen di satu layar pakai rotasi + shadow + border rough sekaligus dengan intensitas maksimal — pilih 1-2 titik fokus per layar (misal: kartu kegiatan yang sedang di-hover, atau CTA utama).
- **Roughness Rough.js jangan seragam maksimal di semua tempat.** Card besar: roughness 1.5–2. Input kecil: roughness 1.0–1.2. Kalau semua elemen sama-sama "berantakan", hasilnya terasa berisik, bukan playful.
- **Kontras teks tetap dijaga.** Warna `--color-ink` (#3A3238) di atas cream/pastel harus tetap lulus kontras WCAG AA untuk teks body — jangan taruh teks Poppins kecil di atas pink/biru pastel dengan opacity terlalu tinggi.
- **Reduced motion dihormati.** Semua animasi hover/rotate/transisi wajib dibungkus media query:
  ```css
  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition: none !important; }
  }
  ```
- **Mobile:** Cabin Sketch di judul tetap harus terbaca di layar kecil — turunkan ke ukuran mobile yang sudah ditentukan di skala tipografi (2.2), jangan dipaksa ukuran desktop.

---

## 7. Asset Checklist

- [ ] `crayon-texture.svg` — tekstur noise/scribble tipis untuk background (generate via Figma/Illustrator atau tool noise generator, opacity rendah)
- [ ] 3–5 scribble aksen dekoratif (bentuk bebas: awan, pesawat kertas, matahari, garis lengkung) dalam pink/biru/kuning, format SVG, untuk ditempatkan di sudut layout tiap halaman
- [ ] Import Google Fonts: Cabin Sketch (400, 700) + Poppins (300–700)
- [ ] Install `roughjs` di frontend
- [ ] Buat komponen reusable `PencilBorder.tsx` dan `PencilDivider.tsx` di `frontend/src/components/ui/`
- [ ] Definisikan seluruh token di `@theme` sesuai section 4

---

## 8. Ringkasan Token (Quick Reference)

```
Colors:
  pink            #FFB3C6
  blue            #A2D2FF
  cream (bg)      #FFF8F0
  crayon-yellow   #FFD97D
  crayon-mint     #B5EAD7
  ink (text)      #3A3238
  ink-soft        #7A7178

Fonts:
  Display   Cabin Sketch (700 headings, 400 aksen kecil)
  Body      Poppins (300–700)

Border style:  Rough.js hand-drawn (card/modal/input) atau SVG turbulence filter (divider/underline)
Background:    Cream + crayon texture SVG (subtle) + scribble aksen dekoratif per halaman
Shadow:        Offset solid tanpa blur, tint warna kartu
Radius:        16–24px, boleh asimetris
```
