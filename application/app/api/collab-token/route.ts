import { ApiError } from "@/lib/apiError";
import { asyncHandler } from "@/lib/asyncHandler";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken';
import { prisma } from "@/app/prisma/db";

export const POST = asyncHandler(async (req: NextRequest) => {
    const session = await getServerSession()

    if (!session || !session.user) {
        throw new ApiError("Unauthenticated", 401)
    }

    const secret = process.env.COLLAB_TOKEN_SECRET as string;

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id
        },
        select: {
            collaborationToken: true,
            id: true
        }
    })

    if (!user) {
        throw new ApiError("User not found", 404)
    }

    if (user.collaborationToken) {
        try {
            jwt.verify(user.collaborationToken, secret);
            return new Response(JSON.stringify({ "data": user.collaborationToken }), { status: 200 });
        } catch (error) {
            const payload = {
                'userId': session.user.id,
                'name': session.user.name
            }

            const options = {
                expiresIn: 3600
            }

            const token = jwt.sign(payload, secret, options);

            await prisma.user.update({
                where: {
                    id: session.user.id
                },
                data: {
                    collaborationToken: token
                }
            })

            return new Response(JSON.stringify({ "data": token }), { status: 200 });
        }
    }
    throw new ApiError("Problem while generating token", 400)
})

export const GET = asyncHandler(async (req: NextRequest) => {
    const session = await getServerSession()

    if (!session || !session.user) {
        throw new ApiError("Unauthenticated", 401)
    }

    const secret = process.env.COLLAB_TOKEN_SECRET as string;

    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email
        },
        select: {
            collaborationToken: true,
            id: true
        }
    })

    return new Response(JSON.stringify({ "data": user?.collaborationToken }), { status: 200 });
})