import { Service } from "typedi";
import { CompanyDAO } from "../daos";
import {
  CreateCompanyByLocalDto,
  CreateCompanyHistoryDto,
  CreateCompanyInfoDto,
  UpdateCompanyHistoryDto,
  UpdateCompanyInfoDto,
} from "../dtos";
import { ICompanyService } from "../types";
import { generateHashPassword } from "../utils";

@Service()
export class CompanyService implements ICompanyService {
  constructor(private companyDAO: CompanyDAO) {}

  async createCompany({
    email,
    password,
  }: Omit<CreateCompanyByLocalDto, "passwordConfirm">) {
    const { hash: hasedPassword, salt } = await generateHashPassword(password);

    const input = {
      email,
      password: hasedPassword,
      salt,
    };
    return this.companyDAO.createCompany(input);
  }

  findCompanyById(id: number) {
    return this.companyDAO.findCompanyById(id);
  }

  findCompanyList(data: { start: number; limit: number }) {
    return this.companyDAO.findCompanyList(data);
  }

  findCompanyInfo(id: number) {
    return this.companyDAO.findCompanyInfo(id);
  }

  findCompanyHistory(id: number) {
    return this.companyDAO.findCompanyHistory(id);
  }

  createCompanyInfo(id: number, data: CreateCompanyInfoDto) {
    return this.companyDAO.createCompanyInfo(id, data);
  }

  updateCompanyInfo(id: number, data: UpdateCompanyInfoDto) {
    return this.companyDAO.updateCompanyInfo(id, data);
  }

  createCompanyHistory(id: number, data: CreateCompanyHistoryDto) {
    return this.companyDAO.createCompanyHistory(id, data);
  }

  updateCompanyHistory(id: number, data: UpdateCompanyHistoryDto) {
    return this.companyDAO.updateCompanyHistory(id, data);
  }
}
