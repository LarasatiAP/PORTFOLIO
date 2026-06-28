import { requireAuth } from '@/lib/auth';
import { deleteProjectImage } from '@/lib/db';

export async function DELETE(request, { params }) {
  const isAuth = await requireAuth();
  if (!isAuth) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const img = await deleteProjectImage(id);

  if (img?.filename) {
    if (img.filename.startsWith('https://') && process.env.BLOB_READ_WRITE_TOKEN) {
      // Production: delete from Vercel Blob
      try {
        const { del } = await import('@vercel/blob');
        await del(img.filename);
      } catch { /* ignore */ }
    } else if (img.filename.startsWith('/uploads/')) {
      // Local dev: delete from disk
      try {
        const { unlink } = await import('fs/promises');
        const path = await import('path');
        await unlink(path.join(process.cwd(), 'public', img.filename));
      } catch { /* ignore */ }
    }
  }

  return Response.json({ success: true });
}
