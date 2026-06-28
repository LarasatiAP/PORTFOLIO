import { initDb } from '@/lib/db';

// Secret key to protect this endpoint
const INIT_SECRET = process.env.INIT_SECRET || '';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (!INIT_SECRET || secret !== INIT_SECRET) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const result = await initDb();
    return Response.json({ 
      ok: true, 
      message: 'Database initialized successfully',
      mode: result.mode,
      hasDBUrl: !!process.env.DATABASE_URL
    });
  } catch (err) {
    console.error('Init DB error:', err);
    return Response.json({ 
      error: err.message, 
      stack: err.stack,
      hasDBUrl: !!process.env.DATABASE_URL 
    }, { status: 500 });
  }
}

export async function POST(request) {
  const { secret } = await request.json().catch(() => ({}));

  if (!INIT_SECRET || secret !== INIT_SECRET) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const result = await initDb();
    return Response.json({ 
      ok: true, 
      message: 'Database initialized successfully',
      mode: result.mode 
    });
  } catch (err) {
    console.error('Init DB error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
