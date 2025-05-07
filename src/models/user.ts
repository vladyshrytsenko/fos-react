export interface User {
    id?: number;
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role?: Role;
}

export enum Role {
    Admin = 'ADMIN',
    User = 'USER',
    Agent = 'AGENT',
    Guest = 'GUEST'
}
