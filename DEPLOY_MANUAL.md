# 🚀 Deploy Manual ke Vercel

Karena auto-deploy dari GitHub tidak jalan, kita akan deploy manual dari terminal.

## Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

## Step 2: Login ke Vercel

```bash
vercel login
```

Ikuti instruksi untuk login (biasanya buka link di browser).

## Step 3: Deploy

Di folder project, jalankan:

```bash
vercel --prod
```

Ikuti pertanyaan:
- Set up and deploy? **Y**
- Which scope? Pilih account kamu
- Link to existing project? **N** (kalau mau project baru) atau **Y** (kalau mau link ke yang lama)
- What's your project's name? **portfolio**
- In which directory is your code located? **./**

Setelah itu, CLI akan:
1. Build project
2. Upload ke Vercel
3. Kasih URL hasil deployment

**PENTING:** Kalau ada error saat build, CLI akan show error message-nya langsung!

## Step 4: Set Environment Variables

Setelah deploy, set env vars:

```bash
vercel env add DATABASE_URL
vercel env add BLOB_READ_WRITE_TOKEN
vercel env add AUTH_SECRET
vercel env add ADMIN_EMAIL
vercel env add ADMIN_PASSWORD
vercel env add INIT_SECRET
vercel env add NEXT_PUBLIC_EMAIL
vercel env add NEXT_PUBLIC_GITHUB
vercel env add NEXT_PUBLIC_LINKEDIN
vercel env add NEXT_PUBLIC_LOCATION
```

Pilih environment: **Production**

## Step 5: Redeploy

```bash
vercel --prod
```

Done! 🎉
