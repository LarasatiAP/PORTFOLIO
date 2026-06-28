import { authenticateAdmin } from '@/lib/auth';

export async function POST(request) {
  const { email, password } = await request.json();
  const result = await authenticateAdmin(email, password);
  
  if (result.success) {
    return Response.json({ success: true });
  }
  
  return Response.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
}
