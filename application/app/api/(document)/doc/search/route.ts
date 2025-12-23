import { prisma } from "@/app/prisma/db";
import { ApiError } from "@/lib/apiError";
import { asyncHandler } from "@/lib/asyncHandler";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export const GET = asyncHandler(async (req: NextRequest) => {

    const { searchParams } = new URL(req.url);

    const doc_name = searchParams.get("to_search");

    if (!doc_name) {
        throw new ApiError("Please Provide document name", 404);
    }

    const session = await getServerSession();
    if (!session || !session.user.email) {
        throw new ApiError("Unauthenticated", 401);
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session.user?.email
        }
    })

    if (!user) {
        throw new ApiError("User not found", 404);
    }

    const documents = await prisma.documents.findMany({
        where: {
            name: {
                contains: doc_name
            },
            userId: user.id
        }
    })

    return Response.json({ data: documents }, { status: 200 });
})