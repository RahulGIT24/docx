import { prisma } from '@/app/prisma/db';
import { ApiError } from '@/lib/apiError';
import { asyncHandler } from '@/lib/asyncHandler';
import { clearDocFromRedis, getDocumentFromRedis, setDocumentInRedis } from '@/lib/document';
import { options } from '@/lib/options';
import { persist } from '@/lib/persistDocFunction';
import { generateToken } from '@/lib/randomToken';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export const GET = asyncHandler(async (request: NextRequest, context: { params: Promise<{ doc_id: string }> }) => {
    const id = (await (await context).params).doc_id;
    const session = await getServerSession(options);

    if (!session || !session.user.email) {
        throw new ApiError("Unauthorized", 401)
    }

    const user_email = session?.user.email as string

    const user = await prisma.user.findUnique({
        where: {
            email: user_email
        },
    });

    if (!user) {
        throw new ApiError("User Not Found", 404);
    }

    const document = await prisma.documents.findUnique({
        where: {
            id: Number(id),
            userId: user.id,
            isDeleted: false,
        },
    })

    if (!document) {
        throw new ApiError("Document Not Found", 404);
    }

    const cache = await getDocumentFromRedis(`doc:${document.id}`);

    if (cache) {
        const { userId, json, ...obj } = document;
        const objToSend = { ...obj, json: cache }
        return Response.json({ "data": objToSend }, { status: 200 });
    } else {
        const { userId, ...obj } = document;
        return Response.json({ "data": obj }, { status: 200 });
    }
})

interface Update {
    name?: string
    json?: string
    isShared?: boolean,
    sharingToken?: string | null,
    editAccess?: boolean
}

export const PATCH = asyncHandler(async (request: NextRequest, context: { params: Promise<{ doc_id: string }> }) => {
    const id = (await (await context).params).doc_id;
    const body = await request.json() as Update;

    const session = await getServerSession(options);
    const { name, json, isShared, editAccess } = body

    if (!session || !session.user.email) {
        throw new ApiError('Unauthorized', 401)
    }

    const user_email = session?.user.email as string

    const user = await prisma.user.findUnique({
        where: {
            email: user_email
        },
    });

    if (!user) {
        throw new ApiError('User Not Found', 404)
    }

    const data: Update = {}
    if (json) {
        await setDocumentInRedis(Number(id), json);
    }

    if (name) {
        data.name = name;
    }

    data.isShared = isShared
    data.editAccess = editAccess

    if (isShared === false) {
        data.sharingToken = null;
        data.editAccess=false;
    }
    if (isShared === true) {
        data.sharingToken = generateToken();
    }

    if(editAccess){
        await persist(`doc:${id}`)
    }

    const document = await prisma.documents.update({
        where: {
            id: Number(id),
            userId: user.id,
            isDeleted: false
        },
        data: data
    })

    if (!document) {
        throw new ApiError('Document Not Found', 404)
    }

    return Response.json({ "data": document, }, { status: 200 });
})

export const DELETE = asyncHandler(async (request: NextRequest, context: { params: Promise<{ doc_id: string }> }) => {
    const id = (await (await context).params).doc_id;
    const session = await getServerSession(options);


    if (!session || !session.user.email) {
        throw new ApiError('Unauthorized', 401)
    }

    const user_email = session?.user.email as string

    const user = await prisma.user.findUnique({
        where: {
            email: user_email
        },
    });

    if (!user) {
        throw new ApiError('User not found', 404)
    }

    const document = await prisma.documents.update({
        where: {
            id: Number(id),
            userId: user.id,
            isDeleted: false
        },
        data: {
            isDeleted: true
        }
    })
    await clearDocFromRedis(`doc:${document.id}`);

    if (!document) {
        throw new ApiError('Document not found', 404)
    }

    return Response.json({ "data": "Updated Successfully" }, { status: 200 });
})