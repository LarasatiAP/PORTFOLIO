import { requireAuth } from '@/lib/auth';
import { upsertSetting } from '@/lib/db';

export async function POST(request) {
  try {
    const isAuth = await requireAuth();
    if (!isAuth) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) return Response.json({ error: 'File required' }, { status: 400 });

    const ext = file.name.split('.').pop().toLowerCase();
    let url;

    // Check if using Supabase Storage (preferred) or Vercel Blob
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      // Production: Supabase Storage
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      const filename = `profile/photo-${Date.now()}.${ext}`;
      const arrayBuffer = await file.arrayBuffer();
      
      const { data, error } = await supabase.storage
        .from('portfolio-uploads')
        .upload(filename, arrayBuffer, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Supabase profile upload error:', error);
        return Response.json({ 
          error: error.message,
          details: error,
          bucket: 'portfolio-uploads',
          filename 
        }, { status: 500 });
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-uploads')
        .getPublicUrl(filename);

      url = publicUrl;
    } else if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Fallback: Vercel Blob
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
  } catch (err) {
    console.error('Profile upload error:', err);
    return Response.json({ 
      error: err.message,
      stack: err.stack,
      type: err.constructor.name 
    }, { status: 500 });
  }
}
