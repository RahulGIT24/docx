import { prisma } from '@/app/prisma/db';
import { options } from '@/lib/options';
import { getServerSession } from 'next-auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(options);
    if (session?.user == null) {
        return Response.json({ "message": 'Unauthorized' }, { status: 401 });
    }
    const templates = await prisma.template.findMany({})

    return Response.json({ data: templates }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error while creating document" }, { status: 500 });
  }
}