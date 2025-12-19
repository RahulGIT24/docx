
import { redis } from "../config/redis";

const DIRTY_DOCS = "dirty_docs";

export async function setDocumentInRedis(docId: number, json: string) {
    const key = `doc:${docId}`;

    await redis.set(key, json);
    await redis.expire(key,60*60*24*30)
}

export async function getDocumentFromRedis(key:string) {
    return redis.get(key);
}

export async function clearDocFromRedis(key: string) {
    await redis.del(key);
}
