import type IUser from "../shared/models/IUser";

export const fakeUser: IUser = {
    id: String(123), 
  username: 'fakeUser',
  role: 'USER'
};

export const fakeAdmin: IUser = { id: String(456), username: 'TestUser', role: 'ADMIN' }