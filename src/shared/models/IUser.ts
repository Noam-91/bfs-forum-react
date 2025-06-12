export type Role =  "VISITOR"|"UNVERIFIED" | "USER" | "ADMIN" | "SUPER_ADMIN";

export default interface IUser{
    id: string;
    username: string;
    role: Role;
    isActive: boolean;
    firstName?: string;
    lastName?: string;
    imgUrl?: string;
    createdAt?: string;
}

