import { prisma } from "../app/prisma/db";
import { predefinedTemplates } from "../lib/template";

async function main() {
    try {
        await prisma.template.createMany({
            data: predefinedTemplates
        })
        return "Templates added in DB";
    } catch (error) {
        return "Error while loading predefined templates "
    }
}

main().then(r => console.log(r)).catch(e => console.log(e)).finally(async () => {
    await prisma.$disconnect();
});
