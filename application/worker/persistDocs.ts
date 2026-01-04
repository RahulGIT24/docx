import { prisma } from "@/app/prisma/db";
import { redis } from "@/config/redis";
import logger from "@/lib/logger";
import { persist } from "@/lib/persistDocFunction";

export async function persistDocs() {
    try {
        const keys = await redis.keys("doc:*");

        for (const key of keys) {
            const res = await persist(key)
            if (res) {
                logger.info(`${key} Saved to DB`)
            }
        }
    } catch (error) {
        logger.info("Error occured while persisting docs: ", error)
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