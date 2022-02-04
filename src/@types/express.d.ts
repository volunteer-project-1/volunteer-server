import { IUser } from "../types/user";

export {};

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface AuthInfo {}
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface User extends IUser {}
  }
}
