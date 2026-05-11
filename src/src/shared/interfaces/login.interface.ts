export interface LoginResponse {
    accessToken: string,
    user_id: number,
    email: string
}

export interface LoginRequest {
    email: string,
    password: string
}
