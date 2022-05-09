import { ICompany } from "./company";
import { IUser } from "./user";

export interface DefaultTime {
  created_at?: Date;
  updated_at?: Date;
}
export interface UserAndCompany extends IUser, ICompany {
  type?: string;
}

export * from "./user";
export * from "./resume";
export * from "./company";
