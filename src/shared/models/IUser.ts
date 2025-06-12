export type Role =  "VISITOR"|"UNVERIFIED" | "USER" | "ADMIN" | "SUPER_ADMIN";

export default interface IUser{
    avatarUrl: string;
    firstName: string;
    lastName: string;
    email: string;
    id?:string,
    username:string,
    password?:string,
    role:Role,
    isActive:boolean
}


export interface ILoginFormData {
    username:string,
    password:string
}

