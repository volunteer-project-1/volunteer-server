/* eslint-disable camelcase */
import { Service } from "typedi";
import { CompanyDAO } from "../daos";
import {
  CreateCompanyHistoryDto,
  CreateJobDescriptionDto,
  UpdateCompanyDto,
  UpdateCompanyHistoryDto,
} from "../dtos";
import { ICompanyService, ICreateCompany } from "../types";
import { generateHashPassword } from "../utils";

@Service()
export class CompanyService implements ICompanyService {
  constructor(private companyDAO: CompanyDAO) {}

  async createCompany({ email, password, name }: ICreateCompany) {
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

  createJobDescription(
    id: number,
    {
      jdDetails,
      jdWorkCondition,
      jdSteps,
      jdWelfares,
      ...rest
    }: CreateJobDescriptionDto
  ) {
    return this.companyDAO.createJobDescription(id, {
      jobDescription: rest,
      jdDetails,
      jdWorkCondition,
      jdSteps,
      jdWelfares,
    });
  }

  findJobDescriptionById(id: number) {
    return this.companyDAO.findJobDescriptionById(id);
  }

  createResumeApplying(data: {
    userId: number;
    resumeId: number;
    jobDescriptionId: number;
  }) {
    return this.companyDAO.createResumeApplying(data);
  }

  findResumeApplying(userId: number) {
    return this.companyDAO.findResumeApplyingByUserId(userId);
  }
}
