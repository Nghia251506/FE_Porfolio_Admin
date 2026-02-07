export interface UserRequest{
    username: string;
    emai: string;
    fullname: string;
    password: string;
}

export interface UserResponse{
    id: number;
    username: string;
    fullname: string;
    email: string;
    role: 'ADMIN';
    createdAt: Date;
}

export interface LoginRequest{
    username: string;
    password: string;
}

export interface AuthResponse{
    accessToken: string;
    tokenType: string;
    user: UserResponse;
}