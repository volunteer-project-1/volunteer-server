import { Service } from "typedi";
import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { CompanyService } from "../services";
import { ICompanyController } from "../types";
import { assertNonNullish, parseToNumberOrThrow, validateDtos } from "../utils";
import {
  CreateCompanyByLocalDto,
  CreateCompanyHistoryDto,
  CreateJobDescriptionDto,
  UpdateCompanyDto,
  UpdateCompanyHistoryDto,
} from "../dtos";
import { BadReqError, NotFoundError, UnauthorizedError } from "../lib";

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
      createdCompany.id
    );

    if (!company) {
      throw new NotFoundError();
    }

    return res.json({ company });
  };

  findCompanyByEmail = async (
    { body: { email } }: Request<unknown, unknown, { email?: string }>,
    res: Response
  ) => {
    if (!email) {
      throw new BadReqError();
    }

    const company = await this.companyService.findCompanyByEmail(email);

    return res.json({ company });
  };

  updateCompany = async (
    { body, user: company }: Request<unknown, unknown, UpdateCompanyDto>,
    res: Response
  ) => {
    if (!company || !Object.keys(body).length) {
      throw new BadReqError();
    }
    await validateDtos(plainToInstance(UpdateCompanyDto, body));

    const updatedCompany = await this.companyService.updateCompany(
      company.id,
      body
    );

    if (!updatedCompany) {
      throw new BadReqError();
    }

    const found = await this.companyService.findCompanyById(company.id);

    if (!found) {
      throw new NotFoundError();
    }

    return res.json({ company: found });
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

    if (!Object.keys(companys).length) {
      return res.status(204).send();
    }

    return res.json({ companys });
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
      createdCompanyHistory.id
    );

    if (!companyHistory) {
      throw new NotFoundError();
    }

    return res.json({ companyHistory });
  };

  updateCompanyHistory = async (
    {
      body,
      params: { id },
    }: Request<{ id?: string }, unknown, UpdateCompanyHistoryDto>,
    res: Response
  ) => {
    assertNonNullish(id);
    await validateDtos(plainToInstance(UpdateCompanyHistoryDto, body));

    const updatedCompanyHistory =
      await this.companyService.updateCompanyHistory(
        parseToNumberOrThrow(id),
        body
      );

    if (!updatedCompanyHistory) {
      throw new BadReqError();
    }

    const companyHistory = await this.companyService.findCompanyHistory(
      parseToNumberOrThrow(id)
    );

    if (!companyHistory) {
      throw new NotFoundError();
    }

    return res.json({ companyHistory });
  };

  createJobDescription = async (
    {
      body,
      params: { id },
    }: Request<{ id?: string }, unknown, CreateJobDescriptionDto>,
    res: Response
  ) => {
    const parsedId = Number(id);
    if (!id) {
      throw new BadReqError();
    }
    if (!parsedId) {
      throw new BadReqError();
    }

    await validateDtos(new CreateJobDescriptionDto(body));

    const { jobDescription } = await this.companyService.createJobDescription(
      parsedId,
      body
    );

    const jd = await this.companyService.findJobDescriptionById(
      jobDescription.id
    );

    if (!jd) {
      throw new NotFoundError();
    }

    return res.json({ jobDescription: jd });
  };

  createResumeApplying = async (
    {
      query: { resumeId, jdDetailId },
      user,
    }: Request<
      unknown,
      unknown,
      unknown,
      { resumeId?: string; jdDetailId?: string }
    >,
    res: Response
  ) => {
    const parsedResumeId = Number(resumeId);
    const parsedJdDetailId = Number(jdDetailId);

    if (!parsedResumeId || !parsedJdDetailId) {
      throw new BadReqError();
    }

    if (!user) {
      throw new UnauthorizedError();
    }

    const result = await this.companyService.createResumeApplying({
      userId: user.id,
      resumeId: parsedResumeId,
      jdDetailId: parsedJdDetailId,
    });

    return res.json({ result });
  };

  findResumeApplyingByUserId = async (
    { user }: Request<unknown, unknown, unknown>,
    res: Response
  ) => {
    if (!user) {
      throw new UnauthorizedError();
    }
    const resumeApplyings = await this.companyService.findResumeApplying(
      user.id
    );

    if (!resumeApplyings) {
      throw new NotFoundError();
    }

    return res.json({ resumeApplyings });
  };
}
