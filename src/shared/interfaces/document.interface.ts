export interface DocumentResponse {
    id: number,
    title?: string,
    message: string,
}

export interface DocumentR {
    id: number,
    title?: string,
    content: string,
    file_path?: string,
    user_id: number
}