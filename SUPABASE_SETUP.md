# 🚀 Setup Supabase untuk Portfolio

## Step 1: Create Supabase Project

1. Buka https://supabase.com/dashboard
2. Klik **"New Project"**
3. Isi:
   - **Name:** Portfolio
   - **Database Password:** Catat password ini! (contoh: `MySecurePassword123!`)
   - **Region:** Southeast Asia (Singapore) - pilih yang terdekat
4. Klik **"Create new project"**
5. Tunggu ~2 menit sampai project ready

---

## Step 2: Get Database URL

1. Di Supabase Dashboard → Project Settings (icon ⚙️ di sidebar kiri bawah)
2. Klik **"Database"** di sidebar
3. Scroll ke bawah, cari **"Connection string"**
4. Pilih tab **"URI"** (bukan "Supavisor")
5. Copy connection string yang formatnya:
   ```
   postgresql://postgres.xxxxx:MySecurePassword123!@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
6. Ganti `[YOUR-PASSWORD]` dengan password yang kamu buat tadi
7. **Simpan connection string ini!**

---

## Step 3: Setup Storage untuk Upload Gambar

Supabase punya storage built-in, jadi tidak perlu Vercel Blob lagi!

1. Di Supabase Dashboard → **Storage** (di sidebar)
2. Klik **"Create a new bucket"**
3. Isi:
   - **Name:** `portfolio-uploads`
   - **Public bucket:** ✅ CENTANG (karena gambar harus bisa diakses publik)
4. Klik **"Create bucket"**
5. Done! ✅

---

## Step 4: Get Supabase API Keys

1. Di Supabase Dashboard → Project Settings → **API**
2. Copy 2 keys ini:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (panjang)

---

## Step 5: Update Environment Variables di Vercel

### HAPUS dulu project lama di Vercel:

1. Buka https://vercel.com/dashboard
2. Pilih project **portfolio-murex-gamma-50**
3. Settings → **Delete Project**
4. Confirm delete

### IMPORT ulang dari GitHub:

1. Buka https://vercel.com/new
2. Pilih **Import Git Repository**
3. Pilih **LarasatiAP/PORTFOLIO**
4. Klik **Import**

### SET Environment Variables (PENTING!):

Di halaman import, sebelum deploy, klik **Environment Variables** dan isi:

```env
# Database (dari Supabase Step 2)
DATABASE_URL=postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

# Supabase Config (dari Supabase Step 4)
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

**Catatan:** Tidak perlu `BLOB_READ_WRITE_TOKEN` lagi karena pakai Supabase Storage!

---

## Step 6: Deploy!

1. Setelah semua env vars diisi, klik **Deploy**
2. Tunggu 2-3 menit
3. Setelah selesai, copy URL deployment (contoh: `https://portfolio-xxx.vercel.app`)

---

## Step 7: Initialize Database

Setelah deployment sukses, buka browser dan akses:

```
https://portfolio-xxx.vercel.app/api/init?secret=init-larasati-portfolio-2024
```

Kalau berhasil, akan muncul response:
```json
{
  "ok": true,
  "message": "Database initialized successfully",
  "mode": "postgres"
}
```

Database sekarang sudah punya tables dan seed data! ✅

---

## Step 8: Test Website

Akses homepage: `https://portfolio-xxx.vercel.app/`

Kalau berhasil, kamu akan lihat portfolio dengan:
- ✅ Projects (seed data)
- ✅ Experiences (seed data)  
- ✅ About section

---

## Step 9: Login ke Admin Panel

1. Akses: `https://portfolio-xxx.vercel.app/admin/login`
2. Login dengan:
   - Email: `admin@portfolio.com`
   - Password: `admin123`
3. Sekarang kamu bisa:
   - ✅ Upload foto profil
   - ✅ Edit About section
   - ✅ Add/Edit Projects
   - ✅ Add/Edit Experience

---

## 🎉 Done!

Portfolio kamu sekarang:
- ✅ Hosted di Vercel
- ✅ Database di Supabase (Postgres)
- ✅ Storage di Supabase (untuk upload gambar)
- ✅ Auto-deploy dari GitHub
- ✅ Admin panel untuk edit content

---

## 📝 Next Steps (Optional):

### Custom Domain
1. Beli domain di Namecheap/GoDaddy
2. Di Vercel → Project Settings → Domains
3. Add domain dan ikuti instruksi DNS

### Update Content
1. Login ke `/admin`
2. Upload foto profil kamu
3. Edit about section
4. Tambah projects kamu sendiri
5. Update experiences

### Backup Database
Di Supabase Dashboard → Database → Backups
(Free tier: 7 days retention)

---

## 🐛 Troubleshooting

**Error: Database connection failed**
- Check `DATABASE_URL` di Vercel env vars
- Pastikan password di connection string benar
- Pastikan tidak ada typo

**Error: 404 Not Found**  
- Pastikan sudah reimport project di Vercel
- Check deployment logs di Vercel
- Pastikan branch `main` di GitHub up to date

**Upload gambar gagal**
- Check `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Pastikan bucket `portfolio-uploads` sudah dibuat dan public
- Check bucket policies di Supabase Storage

**Cannot login admin**
- Check `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` di env vars
- Clear browser cookies dan coba lagi
