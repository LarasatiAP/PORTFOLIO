import { initDb } from '@/lib/db';

// Secret key to protect this endpoint
const INIT_SECRET = process.env.INIT_SECRET || '';

export async function POST(request) {
  const { secret } = await request.json().catch(() => ({}));

  if (!INIT_SECRET || secret !== INIT_SECRET) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await initDb();
    return Response.json({ ok: true, message: 'Database initialized successfully' });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
