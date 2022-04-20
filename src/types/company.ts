import { Request, Response } from "express";
import { OkPacket } from "mysql2/promise";
import { IUser } from ".";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICompany extends IUser {}
// export interface IComapny extends DefaultTime, ICompanySecret {
//   id: number;
//   email: string;
// }

export interface ICompanyInfo {
  id: number;
  name: string;
  introduce: string;
  founded_at: string;
  member: number;
  investment: number;
  homepage: string;
  email: string;
  phone_number: string;
  address: string;
  industry: string;
  user_id: string;
}

export interface ICompanyHistory {
  id: number;
  content: string;
  history_at: string;
  user_id: string;
}

export interface ICreateComapny {
  email: string;
  password: string;
  salt: string;
}
// export interface ICreateComapny {
//   company: Omit<ICompany, "id">;
//   info: Omit<ICompanyInfo, "id" | "user_id">;
//   history: Omit<ICompanyHistory, "id" | "user_id">;
// }

export interface ICompanyService {
  findCompanyList: (data: {
    start: number;
    limit: number;
  }) => Promise<ICompany[] | undefined>;
}

export interface IComapnyDAO {
  createCompany: (
    data: ICreateComapny
  ) => Promise<{ company: OkPacket; info: OkPacket; history: OkPacket }>;
  findCompanyList: ({
    start,
    limit,
  }: {
    start: number;
    limit: number;
  }) => Promise<ICompany[] | undefined>;
}

export interface ICompanyController {
  //   createUserByLocal: (req: Request, res: Response) => Promise<Response>;
  findCompanyList: (req: Request, res: Response) => Promise<Response>;
}
