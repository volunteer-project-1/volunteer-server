import { Request, Response } from "express";
import { IUser } from ".";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IComapny extends IUser {}
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

export interface ICompanyService {
  findCompanyList: (data: {
    start: number;
    limit: number;
  }) => Promise<IComapny[] | undefined>;
}

export interface IComapnyDAO {
  findCompanyList: ({
    start,
    limit,
  }: {
    start: number;
    limit: number;
  }) => Promise<IComapny[] | undefined>;
}

export interface ICompanyController {
  //   createUserByLocal: (req: Request, res: Response) => Promise<Response>;
  findCompanyList: (req: Request, res: Response) => Promise<Response>;
}
