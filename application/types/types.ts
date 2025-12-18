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
    sharingUrl: string | null
    updatedAt: string
}