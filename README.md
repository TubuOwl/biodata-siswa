# Biodata Rombel 3 – PPKN

Web biodata siswa · Next.js + PostgreSQL Neon + Vercel

## Fitur
- Tambah siswa (Nama, NIM, No. WA)
- Upload foto – klik area foto di kartu siswa (siapa saja bisa, tanpa login)
- Link WhatsApp langsung buka chat WA
- Hapus data siswa
- Cari by nama / NIM
- Data tersimpan di PostgreSQL Neon

---

## Cara Deploy

### 1. Buat database Neon (gratis)
1. Buka https://console.neon.tech → daftar / login
2. Klik **New Project** → beri nama, pilih region **Singapore**
3. Klik **Connect** → salin **Connection string** (dipakai di langkah 3)

### 2. Push ke GitHub
```bash
git init
git add .
git commit -m "biodata rombel 3"
git remote add origin https://github.com/USERNAME/biodata-rombel3.git
git push -u origin main
```

### 3. Deploy ke Vercel
1. Buka https://vercel.com → **Add New Project** → import repo tadi
2. Di **Environment Variables** tambahkan:
   - Key  : `DATABASE_URL`
   - Value : *(paste connection string Neon)*
3. Klik **Deploy** → selesai!

> Tabel database dibuat otomatis saat pertama kali halaman diakses.

### Jalankan lokal
```bash
npm install
cp .env.example .env.local   # isi DATABASE_URL
npm run dev                  # buka http://localhost:3000
```
