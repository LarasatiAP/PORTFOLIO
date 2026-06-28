import { requireAuth } from '@/lib/auth';
import { getAllSettings, upsertSettings } from '@/lib/db';

export async function GET() {
  const settings = await getAllSettings();
  return Response.json(settings);
}

export async function PUT(request) {
  const isAuth = await requireAuth();
  if (!isAuth) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await request.json();
  await upsertSettings(data);
  return Response.json({ success: true });
}
