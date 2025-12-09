interface DocumentLayoutProps {
    children: React.ReactNode
}

const DocumentsLayout = ({children}:DocumentLayoutProps)=>{
    return (
        <div className="flex flex-col">
            <p className="text-md p-1 font-semibold text-blue-700">Docx - Name of Document</p>
            {children}
        </div>
    )

}

export default DocumentsLayout;