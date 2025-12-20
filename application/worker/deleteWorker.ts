import { prisma } from '@/app/prisma/db';

const hardDelete = async()=>{
    try {
        await prisma.documents.deleteMany({
            where:{
                isDeleted:true
            },
            limit:100
        })
    } catch (error) {
        console.log("Error while hard deleting data");
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