# 🚀 Panduan Deploy ke Vercel dengan Supabase

## ⚠️ PENTING: Setup Supabase & Environment Variables Dulu!

Portfolio ini menggunakan:
- **Database:** Supabase Postgres
- **Storage:** Supabase Storage (untuk upload gambar)
- **Hosting:** Vercel

---

## 1️⃣ Setup Supabase Project

### Create Project
1. Buka https://supabase.com/dashboard (signup kalau belum punya akun)
2. Klik **"New Project"**
3. Isi:
   - **Name:** Portfolio
   - **Database Password:** Catat password ini! Contoh: `MySecurePassword123!`
   - **Region:** Southeast Asia (Singapore) atau yang terdekat
4. Klik **"Create new project"**
5. Tunggu ~2 menit sampai project ready

### Get Database Connection String
1. Di Supabase Dashboard → **Project Settings** (icon ⚙️ di sidebar kiri bawah)
2. Klik **"Database"** di sidebar
3. Scroll ke bawah, cari section **"Connection string"**
4. Pilih tab **"URI"**
5. Toggle **"Display connection pooler"** = OFF (pakai direct connection)
6. Copy connection string, formatnya:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
7. **Ganti `[YOUR-PASSWORD]` dengan password yang kamu buat tadi**
8. Simpan connection string ini untuk Step 3

### Setup Storage Bucket
1. Di Supabase Dashboard → **Storage** (di sidebar)
2. Klik **"Create a new bucket"**
3. Isi:
   - **Name:** `portfolio-uploads`
   - **Public bucket:** ✅ CENTANG INI! (gambar harus publik)
4. Klik **"Create bucket"**

### Get API Keys
1. Di Supabase Dashboard → **Project Settings** → **API**
2. Copy 2 keys ini:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (sangat panjang)

---

## 2️⃣ Delete Project Lama di Vercel (Kalau Ada)

## 2️⃣ Delete Project Lama di Vercel (Kalau Ada)

1. Buka https://vercel.com/dashboard
2. Pilih project **portfolio-murex-gamma-50** (atau nama project lama kamu)
3. **Settings** → scroll ke bawah → **Delete Project**
4. Confirm delete

---

## 3️⃣ Deploy Baru ke Vercel

### Import dari GitHub
1. Buka https://vercel.com/new
2. Pilih **Import Git Repository**
3. Cari dan pilih **LarasatiAP/PORTFOLIO**
4. Klik **Import**

### Set Environment Variables (SEBELUM DEPLOY!)

**JANGAN KLIK DEPLOY DULU!** Scroll ke bawah, expand **Environment Variables**, lalu isi semua variable ini:

```env
# Supabase Database (dari Step 1)
DATABASE_URL=postgresql://postgres:MySecurePassword123!@db.xxxxx.supabase.co:5432/postgres

# Supabase API (dari Step 1)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Admin Auth
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=admin123
AUTH_SECRET=p0rtf0l10-s3cr3t-k3y-larasati-2024-xK9mN2pQ

# Init Secret
INIT_SECRET=init-larasati-portfolio-2024

# Public Contact Info
NEXT_PUBLIC_EMAIL=larasatiap05@gmail.com
NEXT_PUBLIC_GITHUB=https://github.com/LarasatiAP
NEXT_PUBLIC_LINKEDIN=https://www.linkedin.com/in/larasati-anditta-putri-892b052b3/
NEXT_PUBLIC_LOCATION=Indonesia
```

**PENTING:**
- Ganti `DATABASE_URL` dengan connection string kamu dari Supabase
- Ganti `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` dari Supabase
- **TIDAK PERLU** `BLOB_READ_WRITE_TOKEN` lagi!

### Deploy
1. Setelah semua env vars diisi, klik **Deploy**
2. Tunggu 2-3 menit
3. Kalau berhasil, copy URL deployment (contoh: `https://portfolio-abc123.vercel.app`)

---

## 4️⃣ Initialize Database

Setelah deployment sukses ✅, buka browser dan akses:

```
https://portfolio-abc123.vercel.app/api/init?secret=init-larasati-portfolio-2024
```

Ganti `portfolio-abc123.vercel.app` dengan URL Vercel kamu!

**Expected Response (sukses):**
```json
{
  "ok": true,
  "message": "Database initialized successfully",
  "mode": "postgres",
  "hasDBUrl": true
}
```

Ini akan:
- ✅ Create tables (projects, experiences, settings, project_images)
- ✅ Insert seed data (contoh projects & experiences)
- ✅ Insert default settings (about section, contact info)

---

## 5️⃣ Test Website

Akses homepage: `https://portfolio-abc123.vercel.app/`

Kalau berhasil, kamu akan lihat:
- ✅ Hero section dengan animasi
- ✅ About section
- ✅ Projects (3 contoh projects dari seed data)
- ✅ Experience timeline
- ✅ Skills section
- ✅ Contact section

---

## 6️⃣ Login ke Admin Panel

1. Akses: `https://portfolio-abc123.vercel.app/admin/login`
2. Login dengan:
   - **Email:** `admin@portfolio.com`
   - **Password:** `admin123`

Setelah login, kamu bisa:
- ✅ Upload foto profil
- ✅ Edit About section (paragraf & info boxes)
- ✅ Add/Edit/Delete Projects
- ✅ Upload gambar untuk projects
- ✅ Add/Edit/Delete Experience & Education

---

## ✅ Checklist - Pastikan Semua Done

- [ ] Supabase project sudah dibuat
- [ ] `DATABASE_URL` sudah dicopy dari Supabase
- [ ] Supabase bucket `portfolio-uploads` sudah dibuat & public
- [ ] `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` sudah dicopy
- [ ] Project lama di Vercel sudah dihapus (kalau ada)
- [ ] Project baru sudah diimport dari GitHub ke Vercel
- [ ] Semua environment variables sudah diisi di Vercel
- [ ] Deployment berhasil (status: Ready)
- [ ] Sudah akses `/api/init?secret=...` untuk initialize database
- [ ] Homepage bisa dibuka tanpa error
- [ ] Bisa login ke `/admin/login`

---

## 🔍 Troubleshooting

### Error: 500 Internal Server Error saat buka homepage

**Penyebab:** Database belum diinit atau `DATABASE_URL` salah

**Solusi:**
1. Check env vars di Vercel → Project Settings → Environment Variables
2. Pastikan `DATABASE_URL` benar (coba login ke Supabase dan query manual)
3. Akses `/api/init?secret=init-larasati-portfolio-2024`
4. Check response - kalau error, screenshot dan debug

### Error: Failed to upload image

**Penyebab:** Supabase Storage belum dikonfigurasi

**Solusi:**
1. Check bucket `portfolio-uploads` ada di Supabase Storage
2. Pastikan bucket is **Public**
3. Check `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` di env vars
4. Redeploy kalau perlu: Vercel Dashboard → Deployments → ... → Redeploy

### Error: Cannot login admin

**Penyebab:** `AUTH_SECRET` atau credentials salah

**Solusi:**
1. Check `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` di env vars
2. Clear browser cookies
3. Try incognito/private mode

### Error: 404 Not Found

**Penyebab:** Routing issue atau deployment gagal

**Solusi:**
1. Check Vercel deployment logs: Deployments → click latest → View Function Logs
2. Pastikan build sukses (ada checkmark hijau)
3. Coba redeploy
4. Kalau masih 404, delete project dan reimport ulang

---

## 📝 Architecture Notes

### Database Mode
- **Production (Vercel):** Supabase Postgres
  - Aktif kalau `DATABASE_URL` ada
  - SQLite di-exclude dari build via `serverExternalPackages`
  
- **Local Development:** SQLite  
  - Aktif kalau `DATABASE_URL` kosong
  - File database di `data/portfolio.db`

### Image Storage
- **Production:** Supabase Storage (bucket: `portfolio-uploads`)
- **Local Dev:** Public folder (`/uploads`)

Semua ini di-handle otomatis di `src/lib/db.js` dan upload routes.
