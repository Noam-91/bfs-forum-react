export default interface IUser{
    id?:string,
    username:string,
    password?:string,
    role:Role
}

type Role = "VISITOR" | "UNVERIFIED" | "USER" | "ADMIN" | "SUPER_ADMIN";