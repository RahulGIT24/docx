import { prisma } from '@/app/prisma/db';
import { options } from '@/lib/options';
import { getServerSession } from 'next-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = await getServerSession(options);
    if (session?.user == null) {
        return Response.json({ "message": 'Unauthorized' }, { status: 401 });
    }

    const { id } = body;

    let docName:string = "Untitled Document";
    let loadedJSON:string = "";

    if(id){
      const template = await prisma.template.findUnique({where:{id:id}})
      if(template){
        loadedJSON = template.json;
        docName = template.name;
      }else{
        return Response.json({error:"Template not found"},{status:404})
      }
    }

    const createdDoc = await prisma.documents.create({
      data: {
        json: loadedJSON,
        name: docName,
        userId: session.user.id
      }
    })

    return Response.json({ data:createdDoc }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Error while creating document" }, { status: 500 });
  }
}