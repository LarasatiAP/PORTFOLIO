# 🚀 Deployment Guide - Portfolio ke Vercel + Supabase

## 📋 Prerequisites

- ✅ Akun GitHub (code sudah di repository)
- ✅ Akun Supabase (gratis di https://supabase.com)
- ✅ Akun Vercel (gratis di https://vercel.com)

---

## Step 1️⃣: Setup Supabase Database (5 menit)

### 1. Create Supabase Project

1. Login ke https://supabase.com/dashboard
2. Klik **"New Project"**
3. Isi form:
   - **Name:** Portfolio
   - **Database Password:** Buat password (CATAT INI!)
   - **Region:** Southeast Asia (Singapore)
4. Tunggu ~2 menit sampai project ready

### 2. Run SQL Schema

1. Di Supabase Dashboard → **SQL Editor** (sidebar kiri)
2. Klik **"New query"**
3. Copy paste script dari file `supabase-schema.sql` di root project ini
4. Klik **"Run"** atau tekan Ctrl+Enter
5. Seharusnya muncul: "Success. No rows returned"

### 3. Get Connection Details

**A. Database URL:**
1. **Project Settings** (⚙️ icon) → **Database**
2. Section **"Connection string"** → tab **"URI"**
3. Copy connection string:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
4. **Ganti `[YOUR-PASSWORD]`** dengan password yang kamu buat di Step 1

**B. API Keys:**
1. **Project Settings** → **API**
2. Copy:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public key:** `eyJhbGci...` (yang panjang)

### 4. Setup Storage Bucket

1. **Storage** (sidebar) → **Create a new bucket**
2. **Name:** `portfolio-uploads`
3. ✅ **Centang "Public bucket"**
4. Klik **Create bucket**

---

## Step 2️⃣: Deploy ke Vercel (10 menit)

### 1. Delete Project Lama (Kalau Ada)

Kalau kamu sudah pernah deploy sebelumnya dan masih error:
1. Vercel Dashboard → pilih project → Settings
2. Scroll ke bawah → **Delete Project**

### 2. Import Project dari GitHub

1. Buka https://vercel.com/new
2. Klik **"Import Git Repository"**
3. Pilih repository: **LarasatiAP/PORTFOLIO**
4. Klik **"Import"**

### 3. Set Environment Variables

**SEBELUM KLIK DEPLOY**, scroll ke bawah, expand **"Environment Variables"**

Klik tombol **"Add"** atau **"Plaintext"**, lalu paste semua ini:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=admin123
AUTH_SECRET=p0rtf0l10-s3cr3t-k3y-larasati-2024-xK9mN2pQ
INIT_SECRET=init-larasati-portfolio-2024
NEXT_PUBLIC_EMAIL=larasatiap05@gmail.com
NEXT_PUBLIC_GITHUB=https://github.com/LarasatiAP
NEXT_PUBLIC_LINKEDIN=https://www.linkedin.com/in/larasati-anditta-putri-892b052b3/
NEXT_PUBLIC_LOCATION=Indonesia
```

**⚠️ PENTING:** 
- Ganti `NEXT_PUBLIC_SUPABASE_URL` dengan URL dari Supabase
- Ganti `NEXT_PUBLIC_SUPABASE_ANON_KEY` dengan anon key dari Supabase

### 4. Deploy!

1. Klik **"Deploy"**
2. Tunggu 2-3 menit
3. Kalau berhasil, akan muncul **confetti** 🎉 dan URL deployment

---

## Step 3️⃣: Initialize Database (1 menit)

Setelah deployment selesai:

1. Copy URL deployment (contoh: `https://portfolio-abc123.vercel.app`)
2. Buka browser, akses:
   ```
   https://portfolio-abc123.vercel.app/api/init?secret=init-larasati-portfolio-2024
   ```
3. Seharusnya muncul response:
   ```json
   {"ok":true,"mode":"supabase"}
   ```

Ini akan:
- ✅ Isi table `settings` dengan default values
- ✅ Isi table `projects` dengan 3 contoh projects
- ✅ Isi table `experiences` dengan 3 contoh experiences

---

## Step 4️⃣: Test Website

### Homepage
Akses: `https://your-site.vercel.app/`

Seharusnya muncul:
- ✅ Hero section dengan animasi
- ✅ About section
- ✅ 3 Projects (dari seed data)
- ✅ 3 Experiences (dari seed data)
- ✅ Skills, Contact, Footer

### Admin Panel
1. Akses: `https://your-site.vercel.app/admin/login`
2. Login dengan:
   - **Email:** `admin@portfolio.com`
   - **Password:** `admin123`
3. Setelah login, kamu bisa:
   - Upload foto profil
   - Edit about section
   - Add/Edit/Delete projects
   - Upload project images
   - Add/Edit/Delete experiences

---

## 🎉 Done!

Portfolio kamu sekarang:
- ✅ Live di Vercel
- ✅ Database di Supabase (Postgres)
- ✅ Storage di Supabase (untuk images)
- ✅ Auto-deploy dari GitHub (push = auto update)
- ✅ Admin panel untuk edit content

---

## 🔄 Update Portfolio

### Cara 1: Edit via Admin Panel
1. Login ke `/admin`
2. Edit content (projects, experiences, about, etc.)
3. Upload images
4. Changes langsung apply!

### Cara 2: Edit Code
1. Edit code di local
2. Test di `localhost:3000`
3. Commit & push ke GitHub:
   ```bash
   git add .
   git commit -m "Update portfolio"
   git push
   ```
4. Vercel otomatis deploy (tunggu 2-3 menit)

---

## 🐛 Troubleshooting

### Error: "Could not find table in schema cache"
**Penyebab:** Tables belum dibuat di Supabase

**Solusi:**
1. Buka Supabase → SQL Editor
2. Run script dari `supabase-schema.sql`
3. Check di Table Editor, seharusnya ada 4 tables

### Error: 500 Internal Server Error
**Penyebab:** Environment variables salah atau belum diset

**Solusi:**
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Check semua variables ada dan benar
3. Redeploy: Deployments → ... → Redeploy

### Error: Cannot upload image
**Penyebab:** Supabase storage bucket belum dibuat atau tidak public

**Solusi:**
1. Supabase → Storage → Check bucket `portfolio-uploads` exist
2. Klik bucket → Settings → pastikan **Public** is enabled
3. Check env vars `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Error: Cannot login admin
**Penyebab:** `AUTH_SECRET` atau credentials salah

**Solusi:**
1. Check env vars di Vercel
2. Pastikan `ADMIN_EMAIL` dan `ADMIN_PASSWORD` benar
3. Clear browser cookies, coba lagi

---

## 📝 Notes

### Database
- **Production:** Supabase Postgres (semua data di cloud)
- **Local Dev:** Pakai database Supabase yang sama (edit `.env` file)

### Images
- **Production:** Supabase Storage bucket `portfolio-uploads`
- **Local Dev:** Pakai Supabase Storage juga (sharing dengan production)

### Auto Deploy
- Setiap kali push ke branch `main` di GitHub
- Vercel otomatis build & deploy
- Tidak perlu manual deploy lagi!

### Custom Domain (Optional)
1. Beli domain (Namecheap, GoDaddy, dll)
2. Vercel → Project Settings → Domains
3. Add domain → ikuti instruksi DNS

---

## � Security

**File `.env` JANGAN di-commit ke Git!**

File `.env` sudah ada di `.gitignore`, jadi aman.

Kalau mau update env vars:
1. Edit di Vercel Dashboard (bukan di git)
2. Redeploy setelah update

---

## ✅ Checklist

Sebelum consider "done", pastikan:

- [ ] Supabase project sudah dibuat
- [ ] SQL schema sudah di-run (4 tables exist)
- [ ] Storage bucket `portfolio-uploads` sudah dibuat & public
- [ ] Vercel project sudah di-import dari GitHub
- [ ] Environment variables sudah diset di Vercel
- [ ] Deployment sukses (status: Ready)
- [ ] `/api/init` sudah diakses (seed data inserted)
- [ ] Homepage bisa dibuka tanpa error
- [ ] Bisa login ke `/admin`
- [ ] Bisa upload images
- [ ] Auto-deploy jalan (test: edit README, push, check Vercel)

---

**Selamat! Portfolio kamu sudah live! 🎉**
