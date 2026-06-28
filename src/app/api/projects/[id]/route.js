import { requireAuth } from '@/lib/auth';
import { getProjectById, updateProject, deleteProject } from '@/lib/db';

export async function GET(request, { params }) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(project);
}

export async function PUT(request, { params }) {
  const isAuth = await requireAuth();
  if (!isAuth) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const data = await request.json();
  const project = await updateProject(id, data);
  if (!project) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(project);
}

export async function DELETE(request, { params }) {
  const isAuth = await requireAuth();
  if (!isAuth) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await deleteProject(id);
  return Response.json({ success: true });
}
