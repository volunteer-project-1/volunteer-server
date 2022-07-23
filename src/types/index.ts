/* eslint-disable @typescript-eslint/no-empty-interface */
import { Users, Companys } from "@prisma/client";

export interface DefaultTime {
  createdAt?: Date;
  updatedAt?: Date;
}

type UserAndCompanyTyped = Users & Companys;
export interface UserAndCompany extends UserAndCompanyTyped {
  type?: string;
}

// export interface UserAndCompany extends IUser, ICompany {
//   type?: string;
// }

export * from "./user";
export * from "./resume";
export * from "./company";
