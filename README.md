# Portfolio Website (HRifaldi)

Website portofolio statis dengan data proyek dari GitHub API (`HRifaldi`) dan mengecualikan repo `restapi`.

## File utama
- `index.html`
- `styles.css`
- `script.js`

## Kontak
- LinkedIn sudah di-set ke: `https://www.linkedin.com/in/hernanda-rifaldi/`
- Email bisa diisi di `script.js` pada:

```js
const CONTACT_LINKS = {
  linkedin: "https://www.linkedin.com/in/hernanda-rifaldi/",
  email: ""
};
```

Isi `email` dengan alamat email kamu, contoh: `"hello@domain.com"`.

## Deploy GitHub Pages
Workflow sudah disiapkan di `.github/workflows/deploy-pages.yml`.

Langkah:
1. Push project ke branch `main`.
2. Buka repo GitHub > `Settings` > `Pages`.
3. Pada `Build and deployment`, pilih `Source: GitHub Actions`.
4. Setelah workflow sukses, website tersedia di URL Pages repo tersebut.

## Deploy Vercel
File `vercel.json` sudah disiapkan untuk static site.

Langkah:
1. Import repo ini ke Vercel.
2. Pilih framework `Other`.
3. Build command kosong, output directory kosong.
4. Klik deploy.
