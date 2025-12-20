import { prisma } from '@/app/prisma/db';
import logger from '@/lib/logger';

const hardDelete = async()=>{
    try {
        const deleted = await prisma.documents.deleteMany({
            where:{
                isDeleted:true
            },
            limit:100
        })
        if(deleted.count == 0) return;
        logger.info("Delete Documents from Table. Docs Info: ",deleted);
    } catch (error) {
        logger.error("Error while hard deleting data");
    }
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    while (1) {
        await hardDelete();
        await sleep(5000);
    }
}

main();