
import { redis } from "../config/redis";

const DIRTY_DOCS = "dirty_docs";

export async function setDocumentInRedis(docId: number, json: string) {
    const key = `doc:${docId}`;

    await redis.set(key, json);
    await redis.expire(key,60*60*24*30)
}

export async function getDocumentFromRedis(docId: number) {
    return redis.get(`doc:${docId}`);
}

export async function clearDirtyDocFromRedis(docId: number) {
    await redis.del(`doc:${docId}`);
}
