import { getProjectImages } from '@/lib/db';

export async function GET(request, { params }) {
  const { id } = await params;
  const images = await getProjectImages(id);
  return Response.json(images);
}
