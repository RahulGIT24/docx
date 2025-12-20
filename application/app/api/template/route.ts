import { prisma } from '@/app/prisma/db';
import { ApiError } from '@/lib/apiError';
import { asyncHandler } from '@/lib/asyncHandler';
import { options } from '@/lib/options';
import { getServerSession } from 'next-auth';

export const GET = asyncHandler(async (request: Request) => {
  const session = await getServerSession(options);
  if (session?.user == null) {
    throw new ApiError("Unauthorized", 401)
  }
  const templates = await prisma.template.findMany({})

  return Response.json({ data: templates }, { status: 200 });
})