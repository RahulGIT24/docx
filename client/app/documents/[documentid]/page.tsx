import Editor from "./editor";
import ToolBar from "./toolbar";

interface DocumentIdPageProps {
  params: Promise<{documentid:string}>
};

const DocumentIdPage = async({params}:DocumentIdPageProps) => {
  // const doc_id =  (await params).documentid
  const {documentid} = await params;
  return (
    <div className="min-h-screen bg-[#FAF8FD]">
      <ToolBar/>
      <Editor/>
    </div>
  )
}

export default DocumentIdPage;