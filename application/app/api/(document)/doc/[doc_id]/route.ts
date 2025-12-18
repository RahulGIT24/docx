import { prisma } from '@/app/prisma/db';
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
            where:{
                id:Number(id),
                userId:user.id
            },
        })

        if (!document) {
            return Response.json({ "error": "Document Not Found" }, { status: 404 });
        }
        const {userId, ...obj} = document;

        return Response.json({ "data":obj}, { status: 200 });

    } catch (error) {
        return Response.json({ "error": "Internal Server Error" }, { status: 500 });
    }
}
