import { prisma } from "@/app/prisma/db";
import { redis } from "@/config/redis";
import { clearDocFromRedis, getDocumentFromRedis } from "@/lib/document";
import logger from "@/lib/logger";

export async function persistDocs() {
    try {
        const keys = await redis.keys("doc:*");

        for (const key of keys) {
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
            logger.info(`${key} Saved to DB`)
            await clearDocFromRedis(key);
        }
    } catch (error) {
        logger.info("Error occured while persisting docs: ",error)
    }   

}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    while (1) {
        await persistDocs();
        await sleep(5000);
    }
}

main();