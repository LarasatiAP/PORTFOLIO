export const dynamic = 'force-dynamic';

export async function GET() {
  return new Response('Hello from Vercel! Deployment is working.', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
}
