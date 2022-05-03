/* eslint-disable @typescript-eslint/no-empty-interface */
import { Request, Response } from "express";
import { OkPacket } from "mysql2/promise";
import { IUser } from ".";
import {
  CreateCompanyByLocalDto,
  CreateCompanyHistoryDto,
  CreateCompanyInfoDto,
} from "../dtos";

export interface ICompany extends IUser {}

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

export interface ICompanyService {
  findCompanyList: (data: {
    start: number;
    limit: number;
  }) => Promise<ICompany[] | undefined>;

  findCompanyById: (id: number) => Promise<ICompany | undefined>;
  findCompanyInfo: (id: number) => Promise<ICompanyInfo | undefined>;
  findCompanyHistory: (id: number) => Promise<ICompanyHistory | undefined>;

  createCompany: (data: CreateCompanyByLocalDto) => Promise<OkPacket>;
  createCompanyInfo: (
    id: number,
    data: CreateCompanyInfoDto
  ) => Promise<OkPacket>;
  createCompanyHistory: (
    id: number,
    data: CreateCompanyHistoryDto
  ) => Promise<OkPacket>;
}

export interface IComapnyDAO {
  createCompany: (data: ICreateCompany) => Promise<OkPacket>;
  findCompanyById: (id: number) => Promise<ICompany | undefined>;
  findCompanyInfo: (id: number) => Promise<ICompanyInfo | undefined>;
  findCompanyHistory: (id: number) => Promise<ICompanyHistory | undefined>;
  findCompanyList: ({
    start,
    limit,
  }: {
    start: number;
    limit: number;
  }) => Promise<ICompany[] | undefined>;
  createCompanyInfo: (
    companyId: number,
    data: CreateCompanyInfoDto
  ) => Promise<OkPacket>;
  createCompanyHistory: (
    companyId: number,
    data: CreateCompanyHistoryDto
  ) => Promise<OkPacket>;
}

export interface ICompanyController {
  createCompany: (req: Request, res: Response) => Promise<Response>;
  findCompanyList: (req: Request, res: Response) => Promise<Response>;
  createCompanyInfo: (req: Request, res: Response) => Promise<Response>;
  createCompanyHistory: (req: Request, res: Response) => Promise<Response>;
}
