import { Service } from "typedi";
import { Request, Response } from "express";
import { CompanyService } from "../services";
import { ICompanyController } from "../types";
import { assertNonNullish, parseToNumberOrThrow } from "../utils";

type ReqQuery = {
  start?: string;
  limit?: string;
};

@Service()
export class CompanyController implements ICompanyController {
  constructor(private readonly companyService: CompanyService) {}

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
