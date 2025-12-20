import { prisma } from '@/app/prisma/db';
import { options } from '@/lib/options';
import { getServerSession } from 'next-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = await getServerSession(options);
    if (session?.user == null) {
      return Response.json({ "message": 'Unauthorized' }, { status: 401 });
    }

    const { id } = body;
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    })

    if (!user) {
      return Response.json({ error: "User not exist" }, { status: 404 });
    }

    let docName: string = "Untitled Document";
    let loadedJSON: string = "";

    if (id) {
      const template = await prisma.template.findUnique({ where: { id: id } })
      if (template) {
        loadedJSON = template.json;
        docName = template.name;
      } else {
        return Response.json({ error: "Template not found" }, { status: 404 })
      }
    }

    const createdDoc = await prisma.documents.create({
      data: {
        json: loadedJSON,
        name: docName,
        userId: user?.id as number
      }
    })

    return Response.json({ data: createdDoc.id }, { status: 201 });
  } catch (error) {
    console.log(error)
    return Response.json({ error: "Error while creating document" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(options);
    const { searchParams } = new URL(request.url);

    const limit = searchParams.get('limit') ?? 5;
    const page = searchParams.get('page') ?? 1;
    if (session?.user == null) {
      return Response.json({ "message": 'Unauthorized' }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    })

    if (!user) {
      return Response.json({ error: "User not exist" }, { status: 404 });
    }
    const skip = (Number(page) - 1) * Number(limit);

    const docs = await prisma.documents.findMany({
      where: {
        userId: user.id,
        isDeleted:false,
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take:Number(limit),
      skip:skip
    })

    const count = await prisma.documents.count({
      where: {
        userId: user.id,
        isDeleted:false,
      },
      orderBy: {
        updatedAt: 'desc'
      },
    })

    return Response.json({ data: docs,count }, { status: 200 });
  } catch (error) {
    console.log(error)
    return Response.json({ error: "Error while fetching user docs" }, { status: 500 });
  }
}