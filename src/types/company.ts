/* eslint-disable @typescript-eslint/no-empty-interface */
import { Request, Response } from "express";
import { OkPacket, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { DefaultTime } from ".";
import {
  CreateCompanyByLocalDto,
  CreateCompanyHistoryDto,
  CreateJobDescriptionDto,
  FindCompanyDto,
  FindJobDescriptionDto,
  UpdateCompanyDto,
  UpdateCompanyHistoryDto,
} from "../dtos";

export interface ISecret {
  password?: string;
  salt?: string;
}

export interface ICompany extends DefaultTime, ISecret {
  id: number;
  email: string;
  name: string;
  introduce?: string;
  founded_at?: string;
  member?: number;
  acc_investment?: number;
  homepage?: string;
  phone_number?: string;
  address?: string;
  industry_type?: string;
}

export interface ICompanyHistory {
  id: number;
  content: string;
  history_at: string;
  user_id: string;
}

export interface IJobDescription {
  id: number;
  started_at: string;
  deadline_at: string;
  category: string;
  company_id: string;
}
export interface IJobDetail {
  id: number;
  title: string;
  num_recruitment: number;
  role: string;
  requirements: string;
  priority: string;
  job_description_id: string;
}

export interface IWorkCondition {
  id: number;
  type: string;
  time: string;
  place: string;
  job_description_id: string;
}

export interface IJdStep {
  id: number;
  step: number;
  title: string;
  job_description_id: string;
}

export interface IWelfare {
  id: number;
  title: string;
  content: string;
  job_description_id: string;
}

export interface ICreateCompany {
  email: string;
  password: string;
  //   salt: string;
  name: string;
}

export interface ICreateJobDescription {
  jobDescription: Omit<IJobDescription, "id" | "company_id">;
  jdDetails: Omit<IJobDetail, "id" | "job_description_id">[];
  jdWorkCondition: Omit<IWorkCondition, "id" | "job_description_id">;
  jdSteps: Omit<IJdStep, "id" | "job_description_id">[];
  jdWelfares: Omit<IWelfare, "id" | "job_description_id">[];
}

export interface ICompanyService {
  findCompanyList: (data: {
    start: number;
    limit: number;
  }) => Promise<ICompany[] | undefined>;

  findCompanyById: (id: number) => Promise<ICompany | undefined>;
  findCompanyHistory: (id: number) => Promise<ICompanyHistory | undefined>;
  createCompany: (data: CreateCompanyByLocalDto) => Promise<OkPacket>;
  updateCompany: (
    companyId: number,
    data: UpdateCompanyDto
  ) => Promise<ResultSetHeader>;
  createCompanyHistory: (
    id: number,
    data: CreateCompanyHistoryDto
  ) => Promise<OkPacket>;
  updateCompanyHistory: (
    id: number,
    data: UpdateCompanyHistoryDto
  ) => Promise<ResultSetHeader>;
  createJobDescription: (
    id: number,
    data: CreateJobDescriptionDto
  ) => Promise<{
    jobDescription: OkPacket;
    jdDetails: OkPacket[];
    jdWorkCondition: OkPacket;
    jdSteps: OkPacket[];
    jdWelfares: OkPacket[];
  }>;
  findJobDescriptionById: (
    id: number
  ) => Promise<FindJobDescriptionDto | undefined>;
  createResumeApplying: (data: {
    userId: number;
    resumeId: number;
    jdDetailId: number;
  }) => Promise<OkPacket>;
  findResumeApplying: (
    resumeId: number,
    jobDescriptionId: number
  ) => Promise<RowDataPacket[] | undefined>;
}

export interface IComapnyDAO {
  createCompany: (data: ICreateCompany & { salt: string }) => Promise<OkPacket>;
  updateCompany: (
    companyId: number,
    data: UpdateCompanyDto
  ) => Promise<ResultSetHeader>;
  findCompanyById: (id: number) => Promise<FindCompanyDto | undefined>;
  findCompanyHistory: (id: number) => Promise<ICompanyHistory | undefined>;
  findCompanyList: ({
    start,
    limit,
  }: {
    start: number;
    limit: number;
  }) => Promise<ICompany[] | undefined>;

  createCompanyHistory: (
    companyId: number,
    data: CreateCompanyHistoryDto
  ) => Promise<OkPacket>;

  updateCompanyHistory: (
    id: number,
    data: UpdateCompanyHistoryDto
  ) => Promise<ResultSetHeader>;

  createJobDescription: (
    id: number,
    data: ICreateJobDescription
  ) => Promise<{
    jobDescription: OkPacket;
    jdDetails: OkPacket[];
    jdWorkCondition: OkPacket;
    jdSteps: OkPacket[];
    jdWelfares: OkPacket[];
  }>;

  findJobDescriptionById: (
    id: number
  ) => Promise<FindJobDescriptionDto | undefined>;

  createResumeApplying: (data: {
    userId: number;
    resumeId: number;
    jdDetailId: number;
  }) => Promise<OkPacket>;

  findResumeApplyingByUserId: (
    userId: number
  ) => Promise<RowDataPacket[] | undefined>;
}

export interface ICompanyController {
  createCompany: (req: Request, res: Response) => Promise<Response>;
  updateCompany: (req: Request, res: Response) => Promise<Response>;
  findCompanyList: (req: Request, res: Response) => Promise<Response>;
  createCompanyHistory: (req: Request, res: Response) => Promise<Response>;
  updateCompanyHistory: (req: Request, res: Response) => Promise<Response>;
  createJobDescription: (req: Request, res: Response) => Promise<Response>;
  createResumeApplying: (req: Request, res: Response) => Promise<Response>;
  findResumeApplyingByUserId: (
    req: Request,
    res: Response
  ) => Promise<Response>;
}
