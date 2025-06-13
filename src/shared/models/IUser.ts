// IUser.ts
export default interface IUser{
    id: string;
    username: string;
    password?: string;
    role: Role;
    isActive: boolean;
    firstName?: string;
    lastName?: string;
    imgUrl?: string;
    createdAt?: string;
}

export interface ILoginFormData {
    username:string,
    password:string
}
