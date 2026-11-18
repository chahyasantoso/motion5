# NADI measure

The brief and the two agent prompts every NADI measure reuses, so its rows compare. Each agent is a fresh
Sonnet worker at medium effort; the gerak project is installed from tarballs and set up with `npx gerak init`.

## Brief (verbatim)

```text
Buatkan showreel peluncuran produk berdurasi 20 detik untuk "NADI", sebuah
software analitik bisnis real-time (hipotetis). Tagline: "Denyut bisnis Anda,
real-time."

Sebelum menulis kode, rencanakan dulu storyboard singkat: bagian apa saja,
berapa detik masing-masing, objek apa yang bertahan sepanjang video, gerakan
kamera di tiap bagian, dan bagaimana tiap bagian menyambung ke berikutnya.
Setelah itu langsung kerjakan, tanpa bertanya balik.

PRODUK (untuk bahan visual, semua data fiktif)
- Dashboard dengan: grafik garis pendapatan live, kartu KPI (Pendapatan,
  Pelanggan Baru, Churn), bar chart per wilayah, donut chart sumber trafik,
  daftar aktivitas tim, dan satu kartu notifikasi "Lonjakan penjualan +32%".


FORMAT
- Canvas 1080×1920 (9:16), diskalakan agar muat di jendela, latar sekitar hitam.
- Ini showreel untuk direkam jadi MP4, BUKAN halaman interaktif: autoplay saat
  dibuka, tanpa klik, tanpa tombol, tanpa progress bar atau UI palsu di luar
  desain dashboard itu sendiri. Setelah 20 detik, tahan frame terakhir
  (logo + tagline + ajakan "Coba gratis 14 hari").
- Gaya: dark UI modern, latar navy-grafit, kartu semi-transparan bergaya
  glass tapi tetap flat (tanpa gradient berat, boleh glow tipis), sudut membulat,
  bayangan lembut, grid titik halus di latar yang bergerak pelan (parallax).
- Semua teks Bahasa Indonesia, bold, besar, terbaca di layar HP. Angka pada kartu
  dan grafik harus dihitung naik (count-up) mengikuti waktu.

MOTION
- Gunakan kamera virtual (posisi, zoom, rotasi ringan) yang bergerak
  mulus sepanjang video.
- Kartu dan elemen "terbang masuk" dari berbagai kedalaman (ukuran, blur
  palsu lewat opasitas, dan kecepatan parallax berbeda), lalu mengunci ke
  layout dashboard dengan easing spring. Variasikan arah dan jeda (stagger).
- Satu objek hero bertahan sepanjang video: garis grafik pendapatan. Ia mulai
  sebagai titik bercahaya, memanjang jadi garis, menjadi grafik di dalam kartu,
  lalu kamera zoom masuk ke grafik itu dan transisi ke bagian berikutnya
  dimulai dari sana, dan di akhir garis itu membentuk logo NADI.
- TRANSISI HARUS SEAMLESS. Jangan pakai wipe, cut, atau fade-to-black. Setiap
  perpindahan bagian dilakukan lewat gerakan kamera atau objek yang sama
  berubah bentuk.
- Ritme: ada momen tenang dan momen padat, jangan semuanya bergerak dengan
  intensitas yang sama.
```

## gerak agent prompt

```text
You are working in a person's own web project at <folder> (Windows, Git Bash; a git repository). It has gerak installed. Work only inside that folder; read nothing outside it except inside its node_modules. Start by reading its AGENTS.md and follow it. Make the piece below with gerak, as one piece in the pieces folder, named `nadi`. Do not install anything. Commit when done.

The person's request (verbatim):

<brief>

Report briefly when done: the URL path that plays it, the storyboard, how you checked it, every file you read (paths), the commands you ran most and how many review or render rounds you did, what in the guide or tools slowed you down or was missing, and what you could not make work.
```

## Plain HTML/JS agent prompt

```text
You are working in an empty folder at <folder> (Windows, Git Bash; a git repository). Work only inside that folder. Make the piece below as plain HTML, CSS and JavaScript (no build step; no npm install; no libraries from a CDN). To check your work you may drive the installed Chrome or Edge headless from the command line (for example `--headless --screenshot` with a virtual time budget), but install nothing. Commit when done.

The person's request (verbatim):

<brief>

Report briefly when done: the file that plays it, the storyboard, how you checked it, the commands you ran most and how many screenshot rounds you did, what slowed you down, and what you could not make work.
```

## Rows

| Date | Run | Tokens | Calls | Time |
| --- | --- | --- | --- | --- |
| 2026-11-16 | plain HTML | 110.6k | | 6 min |
| 2026-11-16 | gerak | 187.5k | | 11 min |
| 2026-11-18 | plain HTML | 94.1k | 13 | 4.5 min |
| 2026-11-18 | gerak PR 599 | 170.2k | 33 | 12.2 min |
| 2026-11-18 | gerak v3 (PR 600) | 160.5k | 31 | 8.8 min |
| 2026-11-18 | plain HTML | 99.4k | 10 | 4.3 min |
| 2026-11-18 | gerak v3 follow-up (PR 601) | 126.2k | 18 | 6.9 min |
