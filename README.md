# Rifaldi Data Lab

Website portofolio statis untuk menampilkan project terbaru langsung dari GitHub API (`HRifaldi`), dengan beberapa repo dikecualikan dari daftar.

## Struktur Utama
- `index.html`: struktur halaman.
- `styles.css`: styling dan layout responsif.
- `script.js`: integrasi GitHub API, filter, sorting, dan rendering kartu project.

## Konfigurasi Kontak
Perbarui bagian berikut di `script.js`:

```js
const CONTACT_LINKS = {
  linkedin: "https://www.linkedin.com/in/hernanda-rifaldi/",
  email: "rifaldi.hernanda01@gmail.com"
};
```

## Deploy GitHub Pages
Workflow sudah tersedia di `.github/workflows/deploy-pages.yml`.

1. Push perubahan ke branch `main`.
2. Buka `Settings` > `Pages` pada repo GitHub.
3. Pilih `Source: GitHub Actions`.
4. Tunggu workflow selesai, lalu akses URL GitHub Pages repo.

## Deploy Vercel
Konfigurasi statis sudah tersedia di `vercel.json`.

1. Import repo ke Vercel.
2. Pilih framework `Other`.
3. Kosongkan build command dan output directory.
4. Jalankan deploy.
