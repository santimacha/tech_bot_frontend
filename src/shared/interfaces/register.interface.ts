export interface RegisterResponse {
    message: string,
    user: {
        id: number,
        name: string,
        last_name: string,
        email: string
    }
}

export interface RegisterRequest {
    name: string,
    last_name: string,
    email: string,
    password: string
}