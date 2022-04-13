import { Request, Response } from "express";
import { DefaultTime } from ".";

export interface ICompanySecret {
  password?: string;
  salt?: string;
}

export interface IComapny extends DefaultTime, ICompanySecret {
  id: number;
  email: string;
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
