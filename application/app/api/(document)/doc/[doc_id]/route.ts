import { prisma } from '@/app/prisma/db';
import { getDocumentFromRedis, setDocumentInRedis } from '@/lib/document';
import { options } from '@/lib/options';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { doc_id: string } }) {
    const id = (await params).doc_id;
    try {
        const session = await getServerSession(options);

        if (!session || !session.user.email) {
            return Response.json({ "error": "Session Not Found" }, { status: 401 });
        }

        const user_email = session?.user.email as string

        const user = await prisma.user.findUnique({
            where: {
                email: user_email
            },
        });

        if (!user) {
            return Response.json({ "error": "User Not Found" }, { status: 404 });
        }

        const document = await prisma.documents.findUnique({
            where: {
                id: Number(id),
                userId: user.id
            },
        })

        if (!document) {
            return Response.json({ "error": "Document Not Found" }, { status: 404 });
        }

        const cache = await getDocumentFromRedis(Number(document.id));

        if (cache) {
            const { userId, json, ...obj } = document;
            const objToSend = { ...obj, json: cache }
            return Response.json({ "data": objToSend }, { status: 200 });
        } else {
            const { userId, ...obj } = document;
            return Response.json({ "data": obj }, { status: 200 });
        }
    } catch (error) {
        return Response.json({ "error": "Internal Server Error" }, { status: 500 });
    }
}

interface Update {
    name?: string
    json?: string
}

export async function PATCH(request: NextRequest, { params }: { params: { doc_id: string } }) {
    const id = (await params).doc_id;
    const body = await request.json() as Update;

    try {
        const session = await getServerSession(options);
        const { name, json } = body

        if (!session || !session.user.email) {
            return Response.json({ "error": "Session Not Found" }, { status: 401 });
        }

        const user_email = session?.user.email as string

        const user = await prisma.user.findUnique({
            where: {
                email: user_email
            },
        });

        if (!user) {
            return Response.json({ "error": "User Not Found" }, { status: 404 });
        }

        const data: Update = {}
        if (json) {
            await setDocumentInRedis(Number(id), json);
        }

        if (name) {
            data.name = name;
        }

        const document = await prisma.documents.update({
            where: {
                id: Number(id),
                userId: user.id
            },
            data: data
        })

        if (!document) {
            return Response.json({ "error": "Document Not Found" }, { status: 404 });
        }

        return Response.json({ "data": "Updated Successfully" }, { status: 200 });

    } catch (error) {
        return Response.json({ "error": "Internal Server Error" }, { status: 500 });
    }
}