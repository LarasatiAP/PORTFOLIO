# 🚀 Panduan Deploy ke Vercel

## ⚠️ PENTING: Setup Environment Variables Dulu!

Sebelum deploy, kamu **HARUS** setup environment variables di Vercel Dashboard:

### 1️⃣ Setup Neon Database (Required)

1. Buka Vercel Dashboard → pilih project kamu
2. Pergi ke **Storage** tab
3. Klik **Create Database** → pilih **Neon Postgres**
4. Setelah database dibuat, Vercel akan otomatis menambahkan `DATABASE_URL` ke environment variables
5. **ATAU** buat manual di [Neon Console](https://console.neon.tech/) dan copy connection string-nya

### 2️⃣ Setup Vercel Blob Storage (Required untuk upload gambar)

1. Di Vercel Dashboard → **Storage** tab
2. Klik **Create Database** → pilih **Blob**
3. Setelah dibuat, `BLOB_READ_WRITE_TOKEN` akan otomatis ditambahkan ke env variables

### 3️⃣ Tambahkan Environment Variables Manual

Pergi ke **Settings** → **Environment Variables** dan tambahkan:

```env
# Admin Credentials
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=admin123

# Auth Secret (GANTI dengan random string!)
AUTH_SECRET=p0rtf0l10-s3cr3t-k3y-larasati-2024-xK9mN2pQ

# Init Secret (untuk initialize DB pertama kali)
INIT_SECRET=init-larasati-portfolio-2024

# Public Contact Info
NEXT_PUBLIC_EMAIL=larasatiap05@gmail.com
NEXT_PUBLIC_GITHUB=https://github.com/LarasatiAP
NEXT_PUBLIC_LINKEDIN=https://www.linkedin.com/in/larasati-anditta-putri-892b052b3/
NEXT_PUBLIC_LOCATION=Indonesia
```

### 4️⃣ Initialize Database (Pertama Kali Saja)

Setelah deploy berhasil:

1. Buka browser, akses: `https://your-site.vercel.app/api/init?secret=init-larasati-portfolio-2024`
2. Ini akan membuat tables dan seed data
3. Kamu hanya perlu lakukan ini **SEKALI**

### 5️⃣ Redeploy

Setelah semua env variables diset:

```bash
git add .
git commit -m "Add environment variables"
git push
```

Vercel akan otomatis redeploy dengan env variables yang baru.

---

## 🔍 Troubleshooting

### Error: 404 NOT_FOUND
**Penyebab:** `DATABASE_URL` belum diset di Vercel
**Solusi:** Ikuti langkah 1️⃣ di atas

### Error: Cannot connect to database
**Penyebab:** `DATABASE_URL` salah atau database tidak accessible
**Solusi:** 
- Check connection string di Vercel Dashboard → Storage
- Pastikan menggunakan connection string dengan `?sslmode=require`

### Error: Failed to upload image
**Penyebab:** `BLOB_READ_WRITE_TOKEN` belum diset
**Solusi:** Ikuti langkah 2️⃣ di atas

### Login admin tidak bisa
**Penyebab:** `AUTH_SECRET` belum diset atau salah
**Solusi:** Set `AUTH_SECRET` di environment variables (jangan push ke git!)

---

## ✅ Checklist Sebelum Deploy

- [ ] `DATABASE_URL` sudah diset (Neon Postgres)
- [ ] `BLOB_READ_WRITE_TOKEN` sudah diset (Vercel Blob)
- [ ] `AUTH_SECRET` sudah diset (random string)
- [ ] `ADMIN_EMAIL` dan `ADMIN_PASSWORD` sudah diset
- [ ] `INIT_SECRET` sudah diset
- [ ] Semua `NEXT_PUBLIC_*` variables sudah diset
- [ ] Sudah akses `/api/init?secret=...` untuk initialize database

---

## 📝 Architecture Notes

### Database Mode
- **Production (Vercel):** Neon Postgres (serverless)
  - Aktif kalau `DATABASE_URL` ada
  - SQLite (`better-sqlite3`) di-exclude dari build via `serverExternalPackages`
  
- **Local Development:** SQLite  
  - Aktif kalau `DATABASE_URL` kosong
  - File database di `data/portfolio.db`

### Image Storage
- **Production:** Vercel Blob Storage
- **Local:** Public folder (`/uploads`)

Semua ini di-handle otomatis di `src/lib/db.js` dan upload routes.
