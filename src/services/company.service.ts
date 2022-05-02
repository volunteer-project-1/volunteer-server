import { Service } from "typedi";
import { CompanyDAO } from "../daos";
import {
  CreateCompanyByLocalDto,
  CreateCompanyHistoryDto,
  CreateCompanyInfoDto,
} from "../dtos";
import { ICompanyService } from "../types";
import { generateHashPassword } from "../utils";

@Service()
export class CompanyService implements ICompanyService {
  constructor(private companyDAO: CompanyDAO) {}

  async createCompany({ email, password }: CreateCompanyByLocalDto) {
    const { hash: hasedPassword, salt } = await generateHashPassword(password);

    const input = {
      email,
      password: hasedPassword,
      salt,
    };
    return this.companyDAO.createCompany(input);
  }

  findCompanyList(data: { start: number; limit: number }) {
    return this.companyDAO.findCompanyList(data);
  }

  findCompanyInfo(id: number) {
    return this.companyDAO.findCompanyInfo(id);
  }

  createCompanyInfo(id: number, data: CreateCompanyInfoDto) {
    return this.companyDAO.createCompanyInfo(id, data);
  }

  createCompanyHistory(id: number, data: CreateCompanyHistoryDto) {
    return this.companyDAO.createCompanyHistory(id, data);
  }
}
