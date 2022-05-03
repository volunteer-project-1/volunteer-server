import { Service } from "typedi";
import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { CompanyService } from "../services";
import { ICompanyController } from "../types";
import { assertNonNullish, parseToNumberOrThrow, validateDtos } from "../utils";
import {
  CreateCompanyByLocalDto,
  CreateCompanyHistoryDto,
  CreateCompanyInfoDto,
} from "../dtos";
import { NotFoundError } from "../lib";

@Service()
export class CompanyController implements ICompanyController {
  constructor(private readonly companyService: CompanyService) {}

  createCompany = async (
    { body }: Request<unknown, unknown, CreateCompanyByLocalDto>,
    res: Response
  ) => {
    await validateDtos(new CreateCompanyByLocalDto(body));
    const createdCompany = await this.companyService.createCompany(body);

    const company = await this.companyService.findCompanyById(
      createdCompany.insertId
    );

    if (!company) {
      throw new NotFoundError();
    }

    return res.json({ company });
  };

  findCompanyList = async (
    {
      query: { start, limit },
    }: Request<
      unknown,
      unknown,
      unknown,
      {
        start?: string;
        limit?: string;
      }
    >,
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

  createCompanyInfo = async (
    {
      body,
      params: { id },
    }: Request<{ id?: string }, unknown, CreateCompanyInfoDto>,
    res: Response
  ) => {
    assertNonNullish(id);
    await validateDtos(plainToInstance(CreateCompanyInfoDto, body));

    const createdCompanyInfo = await this.companyService.createCompanyInfo(
      parseToNumberOrThrow(id),
      body
    );

    const companyInfo = await this.companyService.findCompanyInfo(
      createdCompanyInfo.insertId
    );

    if (!companyInfo) {
      throw new NotFoundError();
    }

    return res.json({ companyInfo });
  };

  createCompanyHistory = async (
    {
      body,
      params: { id },
    }: Request<{ id?: string }, unknown, CreateCompanyHistoryDto>,
    res: Response
  ) => {
    assertNonNullish(id);
    await validateDtos(plainToInstance(CreateCompanyHistoryDto, body));

    const createdCompanyHistory =
      await this.companyService.createCompanyHistory(
        parseToNumberOrThrow(id),
        body
      );

    const companyHistory = await this.companyService.findCompanyHistory(
      createdCompanyHistory.insertId
    );

    if (!companyHistory) {
      throw new NotFoundError();
    }

    return res.json({ companyHistory });
  };
}
