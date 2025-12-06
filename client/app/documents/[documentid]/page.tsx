import Editor from "./editor";

interface DocumentIdPageProps {
  params: Promise<{documentid:string}>
};

const DocumentIdPage = async({params}:DocumentIdPageProps) => {
  // const doc_id =  (await params).documentid
  const {documentid} = await params;
  return (
    <div className="min-h-screen bg-[#FAF8FD]">
      {/* DocumentIdPage {documentid} */}
      <Editor/>
    </div>
  )
}

export default DocumentIdPage;