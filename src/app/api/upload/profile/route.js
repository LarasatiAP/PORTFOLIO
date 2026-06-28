import { requireAuth } from '@/lib/auth';
import { upsertSetting } from '@/lib/db';

export async function POST(request) {
  const isAuth = await requireAuth();
  if (!isAuth) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file');
  if (!file) return Response.json({ error: 'File required' }, { status: 400 });

  const ext = file.name.split('.').pop().toLowerCase();
  let url;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    // Production: Vercel Blob
    const { put } = await import('@vercel/blob');
    const blob = await put(`profile/photo-${Date.now()}.${ext}`, file, { access: 'public' });
    url = blob.url;
  } else {
    // Local dev: save to public/uploads/
    const { writeFile, mkdir } = await import('fs/promises');
    const { existsSync } = await import('fs');
    const path = await import('path');
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) await mkdir(uploadsDir, { recursive: true });
    const filename = `profile-${Date.now()}.${ext}`;
    await writeFile(path.join(uploadsDir, filename), Buffer.from(await file.arrayBuffer()));
    url = `/uploads/${filename}`;
  }

  await upsertSetting('about_photo', url);
  return Response.json({ url }, { status: 201 });
}
