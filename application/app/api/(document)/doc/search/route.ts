import { prisma } from "@/app/prisma/db";
import { ApiError } from "@/lib/apiError";
import { asyncHandler } from "@/lib/asyncHandler";
import { getServerSession } from "next-auth";
import { useSearchParams } from "next/navigation";
import { NextRequest } from "next/server";

export const GET = asyncHandler(async (req: NextRequest) => {

    const params = useSearchParams();

    const doc_name = params.get("to_search");

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

    if (!documents || documents.length == 0) {
        throw new ApiError("Document not found", 404);
    }

    return Response.json({ data: documents }, { status: 200 });
})