import { prisma } from "@/app/prisma/db";
import { clearDocFromRedis, getDocumentFromRedis } from "./document";

export async function persist(key:string) {
    try {
        const json = await getDocumentFromRedis(key) as string;
        const [_, id] = key.split(':');
        await prisma.documents.update({
            where: {
                id: Number(id)
            },
            data: {
                json: json
            }
        })
        await clearDocFromRedis(key);
        return true
    } catch (e: any) {
        throw e
    }
}
