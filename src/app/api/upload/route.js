import { requireAuth } from '@/lib/auth';
import { addProjectImage } from '@/lib/db';

export async function POST(request) {
  const isAuth = await requireAuth();
  if (!isAuth) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file');
  const projectId = formData.get('projectId');
  const caption = formData.get('caption') || '';

  if (!file || !projectId) {
    return Response.json({ error: 'File and projectId required' }, { status: 400 });
  }

  let url;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    // Production: Vercel Blob
    const { put } = await import('@vercel/blob');
    const ext = file.name.split('.').pop();
    const blob = await put(
      `projects/${projectId}/${Date.now()}-${Math.random().toString(36).substr(2,8)}.${ext}`,
      file, { access: 'public' }
    );
    url = blob.url;
  } else {
    // Local dev: save to public/uploads/
    const { writeFile, mkdir } = await import('fs/promises');
    const { existsSync } = await import('fs');
    const path = await import('path');
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) await mkdir(uploadsDir, { recursive: true });
    const ext = file.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).substr(2,8)}.${ext}`;
    await writeFile(path.join(uploadsDir, filename), Buffer.from(await file.arrayBuffer()));
    url = `/uploads/${filename}`;
  }

  const image = await addProjectImage(projectId, url, caption);
  return Response.json({ ...image, url }, { status: 201 });
}
