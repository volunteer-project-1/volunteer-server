/* eslint-disable camelcase */
import { Service } from "typedi";
import { CompanyDAO } from "../daos";
import {
  CreateCompanyHistoryDto,
  CreateJobDescriptionDto,
  UpdateCompanyDto,
  UpdateCompanyHistoryDto,
} from "../dtos";
import {
  ICompanyService,
  ICreateCompany,
  ICreateJobDescription,
} from "../types";
import { generateHashPassword } from "../utils";

@Service()
export class CompanyService implements ICompanyService {
  constructor(private companyDAO: CompanyDAO) {}

  async createCompany(data: ICreateCompany) {
    const { email, password, name } = data;
    const { hash: hasedPassword, salt } = await generateHashPassword(password);

    const input = {
      email,
      password: hasedPassword,
      salt,
      name,
    };
    return this.companyDAO.createCompany(input);
  }

  updateCompany(companyId: number, data: UpdateCompanyDto) {
    return this.companyDAO.updateCompany(companyId, data);
  }

  findCompanyByEmail(email: string) {
    return this.companyDAO.findCompanyByEmail(email);
  }

  findCompanyById(id: number) {
    return this.companyDAO.findCompanyById(id);
  }

  findCompanyList(data: { start: number; limit: number }) {
    return this.companyDAO.findCompanyList(data);
  }

  findCompanyHistory(id: number) {
    return this.companyDAO.findCompanyHistory(id);
  }

  createCompanyHistory(id: number, data: CreateCompanyHistoryDto) {
    return this.companyDAO.createCompanyHistory(id, data);
  }

  updateCompanyHistory(id: number, data: UpdateCompanyHistoryDto) {
    return this.companyDAO.updateCompanyHistory(id, data);
  }

  createJobDescription(id: number, data: CreateJobDescriptionDto) {
    const { jd_details, jd_work_condition, jd_steps, jd_welfares, ...rest } =
      data;
    const parsedData: ICreateJobDescription = {
      jobDescription: rest,
      jdDetails: jd_details,
      jdWorkCondition: jd_work_condition,
      jdSteps: jd_steps,
      jdWelfares: jd_welfares,
    };
    return this.companyDAO.createJobDescription(id, parsedData);
  }

  findJobDescriptionById(id: number) {
    return this.companyDAO.findJobDescriptionById(id);
  }

  createResumeApplying(data: {
    userId: number;
    resumeId: number;
    jdDetailId: number;
  }) {
    return this.companyDAO.createResumeApplying(data);
  }

  findResumeApplying(userId: number) {
    return this.companyDAO.findResumeApplyingByUserId(userId);
  }
}
