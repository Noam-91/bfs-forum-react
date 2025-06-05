export default interface IUser{
    id?:string,
    email:string,
    password:string,
    role:Role
}

type Role = "ADMIN" | "USER";