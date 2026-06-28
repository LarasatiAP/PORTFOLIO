import { requireAuth } from '@/lib/auth';
import { getAllProjects, createProject } from '@/lib/db';

export async function GET() {
  const projects = await getAllProjects();
  return Response.json(projects);
}

export async function POST(request) {
  const isAuth = await requireAuth();
  if (!isAuth) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await request.json();
  const project = await createProject(data);
  return Response.json(project, { status: 201 });
}
