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

  // Check if using Supabase Storage (preferred) or Vercel Blob
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // Production: Supabase Storage
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const ext = file.name.split('.').pop();
    const filename = `projects/${projectId}/${Date.now()}-${Math.random().toString(36).substr(2,8)}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    
    const { data, error } = await supabase.storage
      .from('portfolio-uploads')
      .upload(filename, arrayBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('portfolio-uploads')
      .getPublicUrl(filename);

    url = publicUrl;
  } else if (process.env.BLOB_READ_WRITE_TOKEN) {
    // Fallback: Vercel Blob
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
