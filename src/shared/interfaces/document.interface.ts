export interface DocumentResponse {
    message: string,
    document: {
        id: number,
        title?: string,
    },
    // fallback por compatibilidad
    id?: number,
    title?: string,
}

export interface DocumentR {
    id: number,
    title?: string,
    content: string,
    file_path?: string,
    user_id: number
}