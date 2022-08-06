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

  /**
   * @swagger
   *  /api/v1/company/my:
   *    get:
   *      tags:
   *      - company-v1
   *      description: 내 company 정보 받기.
   *      comsumes:
   *      - application/json
   *      responses:
   *       '200':
   *         description: 데이터 가져오기 성공
   *         examples:
   *             application/json:
   *                {
   *                    "company": {
   *                        "id": 1,
   *                        "email": "testCompany@gmail.com",
   *                        "name": "testCompany",
   *                        "introduce": null,
   *                        "foundedAt": null,
   *                        "member": 1,
   *                        "accInvestment": 0,
   *                        "homepage": null,
   *                        "phoneNumber": null,
   *                        "address": null,
   *                        "industryType": null,
   *                        "createdAt": "2022-08-06T01:36:45.285Z",
   *                        "updatedAt": "2022-08-06T01:36:45.285Z",
   *                        "deletedAt": null,
   *                        "type": "company"
   *                    }
   *                }
   */
  myCompanyProfile = async ({ user: company }: Request, res: Response) => {
    return res.json({ company });
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
      query: { resumeId, jobDescriptionId },
      user,
    }: Request<
      unknown,
      unknown,
      unknown,
      { resumeId?: string; jobDescriptionId?: string }
    >,
    res: Response
  ) => {
    const parsedResumeId = Number(resumeId);
    const parsedJobDescriptionId = Number(jobDescriptionId);

    if (!parsedResumeId || !parsedJobDescriptionId) {
      throw new BadReqError();
    }

    if (!user) {
      throw new UnauthorizedError();
    }

    const result = await this.companyService.createResumeApplying({
      userId: user.id,
      resumeId: parsedResumeId,
      jobDescriptionId: parsedJobDescriptionId,
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

    if (!resumeApplyings.length) {
      throw new NotFoundError();
    }

    return res.json({ resumeApplyings });
  };
}
