export async function GET() {
  return Response.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      hasDBUrl: !!process.env.DATABASE_URL,
      hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      hasAuthSecret: !!process.env.AUTH_SECRET,
      hasInitSecret: !!process.env.INIT_SECRET,
    }
  });
}
