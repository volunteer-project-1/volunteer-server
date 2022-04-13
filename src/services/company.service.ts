import { Service } from "typedi";
import { CompanyDAO } from "../daos";
import { ICompanyService } from "../types";

@Service()
export class CompanyService implements ICompanyService {
  constructor(private companyDAO: CompanyDAO) {}

  findCompanyList(data: { start: number; limit: number }) {
    return this.companyDAO.findCompanyList(data);
  }
}
