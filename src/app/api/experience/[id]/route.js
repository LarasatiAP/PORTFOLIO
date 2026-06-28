import { requireAuth } from '@/lib/auth';
import { getExperienceById, updateExperience, deleteExperience } from '@/lib/db';

export async function GET(request, { params }) {
  const { id } = await params;
  const experience = await getExperienceById(id);
  if (!experience) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(experience);
}

export async function PUT(request, { params }) {
  const isAuth = await requireAuth();
  if (!isAuth) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const data = await request.json();
  const experience = await updateExperience(id, data);
  if (!experience) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(experience);
}

export async function DELETE(request, { params }) {
  const isAuth = await requireAuth();
  if (!isAuth) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await deleteExperience(id);
  return Response.json({ success: true });
}
