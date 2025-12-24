export type PredefinedTemplatesT = {
    id?: number,
    name: string,
    json: string,
    preview: string
}

export interface Document {
    createdAt: string
    id: number
    isShared: boolean
    json: string
    name: string
    sharingToken: string | null
    editAccess:boolean
    updatedAt: string
    sharingUrl:string | null
}

export interface DocumentRendererProps {
    doc_id?:number
    collab_token?:string
}