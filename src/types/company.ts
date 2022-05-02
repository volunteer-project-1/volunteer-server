/* eslint-disable @typescript-eslint/no-empty-interface */
import { Request, Response } from "express";
import { OkPacket } from "mysql2/promise";
import { IUser } from ".";
import { CreateCompanyByLocalDto } from "../dtos";

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
  acc_investment: number;
  homepage: string;
  email: string;
  phone_number: string;
  address: string;
  industry_type: string;
  user_id: string;
}

export interface ICompanyHistory {
  id: number;
  content: string;
  history_at: string;
  user_id: string;
}

export interface ICreateCompany {
  email: string;
  password: string;
  salt: string;
}

export interface IUpdateCompanyInfo
  extends Omit<ICompanyInfo, "id" | "user_id"> {}
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

  findCompanyInfo: (id: number) => Promise<ICompanyInfo | undefined>;

  createCompany: (data: CreateCompanyByLocalDto) => Promise<OkPacket>;
}

export interface IComapnyDAO {
  createCompany: (data: ICreateCompany) => Promise<OkPacket>;
  findCompanyInfo: (id: number) => Promise<ICompanyInfo | undefined>;
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
