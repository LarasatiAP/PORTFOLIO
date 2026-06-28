import { requireAuth } from '@/lib/auth';
import { getAllExperiences, createExperience } from '@/lib/db';

export async function GET() {
  const experiences = await getAllExperiences();
  return Response.json(experiences);
}

export async function POST(request) {
  const isAuth = await requireAuth();
  if (!isAuth) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await request.json();
  const experience = await createExperience(data);
  return Response.json(experience, { status: 201 });
}
