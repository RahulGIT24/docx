import { prisma } from '@/app/prisma/db';
import { ApiError } from '@/lib/apiError';
import { asyncHandler } from '@/lib/asyncHandler';
import { options } from '@/lib/options';
import { getServerSession } from 'next-auth';

export const POST = asyncHandler(async (request: Request) => {
  const body = await request.json();
  const session = await getServerSession(options);
  if (session?.user == null) {
    throw new ApiError("Unauthorized", 401)
  }

  const { id } = body;
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email
    }
  })

  if (!user) {
    throw new ApiError("User not exist", 404)
  }

  let docName: string = "Untitled Document";
  let loadedJSON: string = "";

  if (id) {
    const template = await prisma.template.findUnique({ where: { id: id } })
    if (template) {
      loadedJSON = template.json;
      docName = template.name;
    } else {
      throw new ApiError("Template Not Found", 404)
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
})

export const GET = asyncHandler(async (request: Request) => {
  const session = await getServerSession(options);
  const { searchParams } = new URL(request.url);

  const limit = searchParams.get('limit') ?? 5;
  const page = searchParams.get('page') ?? 1;
  if (session?.user == null) {
    throw new ApiError('Unauthorized', 401);
  }
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email
    }
  })

  if (!user) {
    throw new ApiError("User not exist", 404)
  }
  const skip = (Number(page) - 1) * Number(limit);

  const docs = await prisma.documents.findMany({
    where: {
      userId: user.id,
      isDeleted: false,
    },
    orderBy: {
      updatedAt: 'desc'
    },
    take: Number(limit),
    skip: skip
  })

  const count = await prisma.documents.count({
    where: {
      userId: user.id,
      isDeleted: false,
    },
    orderBy: {
      updatedAt: 'desc'
    },
  })

  return Response.json({ data: docs, count }, { status: 200 });
})