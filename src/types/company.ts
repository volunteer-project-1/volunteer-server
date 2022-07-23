/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  CompanyHistories,
  Companys,
  JdDetails,
  JdSteps,
  JdWelfares,
  JdWorkConditions,
  JobDescriptions,
  ResumeApplyings,
  Resumes,
} from "@prisma/client";
import { Request, Response } from "express";
import { DefaultTime } from ".";
import {
  CreateCompanyByLocalDto,
  CreateCompanyHistoryDto,
  CreateJobDescriptionDto,
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
  startedAt: string;
  deadlineAt: string;
  category: string;
  companyId: number;
}
export interface IJobDetail {
  id: number;
  title: string;
  numRecruitment: number;
  role: string;
  requirements: string;
  priority: string;
  jobDescriptionId: number;
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
  jobDescription: Omit<JobDescriptions, "id" | "companyId">;
  jdDetails: Omit<JdDetails, "id" | "jobDescriptionId">[];
  jdWorkCondition: Omit<JdWorkConditions, "id" | "jobDescriptionId">;
  jdSteps: Omit<JdSteps, "id" | "jobDescriptionId">[];
  jdWelfares: Omit<JdWelfares, "id" | "jobDescriptionId">[];
}

export interface ICompanyService {
  findCompanyList: (data: {
    start: number;
    limit: number;
  }) => Promise<Companys[]>;

  findCompanyById: (id: number) => Promise<Companys | null>;
  findCompanyHistory: (id: number) => Promise<CompanyHistories | null>;
  createCompany: (data: CreateCompanyByLocalDto) => Promise<Companys>;
  updateCompany: (
    companyId: number,
    data: UpdateCompanyDto
  ) => Promise<Companys>;
  createCompanyHistory: (
    id: number,
    data: CreateCompanyHistoryDto
  ) => Promise<CompanyHistories>;
  updateCompanyHistory: (
    id: number,
    data: UpdateCompanyHistoryDto
  ) => Promise<CompanyHistories>;
  createJobDescription: (
    id: number,
    data: CreateJobDescriptionDto
  ) => Promise<{
    jobDescription: JobDescriptions;
  }>;
  findJobDescriptionById: (id: number) => Promise<
    | (JobDescriptions & {
        jdDetails: JdDetails[];
        jdWorkCondition: JdWorkConditions | null;
        jdSteps: JdSteps[];
        jdWelfares: JdWelfares[];
      })
    | null
  >;
  createResumeApplying: (data: {
    userId: number;
    resumeId: number;
    jobDescriptionId: number;
  }) => Promise<ResumeApplyings>;
  findResumeApplying: (
    resumeId: number,
    jobDescriptionId: number
  ) => Promise<
    (ResumeApplyings & {
      jobDescriptions:
        | (JobDescriptions & {
            jdDetails: JdDetails[];
          })
        | null;
      resumes: Resumes;
    })[]
  >;
}

export interface IComapnyDAO {
  createCompany: (data: ICreateCompany & { salt: string }) => Promise<Companys>;
  updateCompany: (
    companyId: number,
    data: UpdateCompanyDto
  ) => Promise<Companys>;
  findCompanyById: (id: number) => Promise<Companys | null>;
  findCompanyHistory: (id: number) => Promise<CompanyHistories | null>;
  findCompanyList: ({
    start,
    limit,
  }: {
    start: number;
    limit: number;
  }) => Promise<Companys[]>;

  createCompanyHistory: (
    companyId: number,
    data: CreateCompanyHistoryDto
  ) => Promise<CompanyHistories>;

  updateCompanyHistory: (
    id: number,
    data: UpdateCompanyHistoryDto
  ) => Promise<CompanyHistories>;

  createJobDescription: (
    id: number,
    data: ICreateJobDescription
  ) => Promise<{
    jobDescription: JobDescriptions;
    // jdDetails: JdDetails[];
    // jdWorkCondition: JdWorkConditions;
    // jdSteps: JdSteps[];
    // jdWelfares: JdWelfares[];
  }>;

  findJobDescriptionById: (id: number) => Promise<
    | (JobDescriptions & {
        jdDetails: JdDetails[];
        jdWorkCondition: JdWorkConditions | null;
        jdSteps: JdSteps[];
        jdWelfares: JdWelfares[];
      })
    | null
  >;

  createResumeApplying: (data: {
    userId: number;
    resumeId: number;
    jobDescriptionId: number;
  }) => Promise<ResumeApplyings>;

  findResumeApplyingByUserId: (userId: number) => Promise<
    (ResumeApplyings & {
      jobDescriptions:
        | (JobDescriptions & {
            jdDetails: JdDetails[];
          })
        | null;
      resumes: Resumes;
    })[]
  >;
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
