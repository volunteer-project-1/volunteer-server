import { Service } from "typedi";
import { Request, Response } from "express";
import { CompanyService } from "../services";
import { ICompanyController } from "../types";
import { assertNonNullish, parseToNumberOrThrow, validateDtos } from "../utils";
import { CreateCompanyByLocalDto } from "../dtos";

type ReqQuery = {
  start?: string;
  limit?: string;
};

@Service()
export class CompanyController implements ICompanyController {
  constructor(private readonly companyService: CompanyService) {}

  createCompany = async (
    { body }: Request<unknown, unknown, CreateCompanyByLocalDto>,
    res: Response
  ) => {
    await validateDtos(new CreateCompanyByLocalDto(body));
    const { company } = await this.companyService.createCompany(body);
    res.json({ company });
  };

  findCompanyList = async (
    { query: { start, limit } }: Request<unknown, unknown, unknown, ReqQuery>,
    res: Response
  ) => {
    assertNonNullish(start);
    assertNonNullish(limit);

    const parsedQuery = {
      start: parseToNumberOrThrow(start),
      limit: parseToNumberOrThrow(limit),
    };

    const companys = await this.companyService.findCompanyList(parsedQuery);

    if (!companys) {
      return res.status(204).send();
    }

    return res.json({ companys });
  };
}
