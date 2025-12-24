import { prisma } from "@/app/prisma/db";
import { ApiError } from "@/lib/apiError";
import { asyncHandler } from "@/lib/asyncHandler";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export const GET = asyncHandler(async (req: NextRequest) => {
    const url = new URL(req.nextUrl);

    const session = await getServerSession();

    if (!session || !session.user) {
        throw new ApiError("Unauthenticated", 401)
    }

    const token = url.searchParams.get("token");

    if (!token) {
        throw new ApiError("Please Provide collaboration token", 404);
    }

    const document = await prisma.documents.findFirst({
        where: {
            sharingToken: token,
            isDeleted: false,
            isShared: true,
        },
        select: {
            sharingToken: true,
            isDeleted: true,
            isShared: true,
            json: true,
            createdAt: true,
            updatedAt: true,
            collaborationToken: true,
            editAccess: true,
            name: true
        }
    })

    if (!document) {
        throw new ApiError("Document Not Found", 404);
    }

    return Response.json({ "data": document }, { status: 200 });

})