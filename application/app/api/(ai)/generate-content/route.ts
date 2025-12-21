import { aiWrite } from "@/app/ai/bot";
import { ApiError } from "@/lib/apiError";
import { asyncHandler } from "@/lib/asyncHandler";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export const POST = asyncHandler(async (req: NextRequest) => {
    const { query } = await req.json();

    const session = await getServerSession();

    if (!session || !session?.user.email) {
        throw new ApiError("Unauthorized", 401);
    }

    if (!query) {
        throw new ApiError("Please Provide Query", 400);
    }

    const res = await aiWrite(query);

    return Response.json({ data: res }, { status: 200 });
})