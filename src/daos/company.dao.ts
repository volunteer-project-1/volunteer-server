import { Service } from "typedi";
import Prisma from "../db/prisma";
import {
  CreateCompanyHistoryDto,
  UpdateCompanyDto,
  UpdateCompanyHistoryDto,
} from "../dtos";
import { IComapnyDAO, ICreateCompany, ICreateJobDescription } from "../types";

@Service()
export class CompanyDAO implements IComapnyDAO {
  private readonly prisma;

  constructor() {
    // constructor(private readonly prisma: typeof Prisma) {
    this.prisma = Prisma;
  }

  async createCompany({
    email,
    password,
    salt,
    name,
  }: ICreateCompany & { salt: string }) {
    return this.prisma.companys.create({
      data: {
        email,
        password,
        salt,
        name,
      },
    });
  }

  async updateCompany(companyId: number, data: UpdateCompanyDto) {
    return this.prisma.companys.update({
      where: { id: companyId },
      data: { ...data },
    });
  }

  async findCompanyByEmail(email: string) {
    return this.prisma.companys.findUnique({ where: { email } });
  }

  async findCompanyById(id: number) {
    return this.prisma.companys.findUnique({ where: { id } });
  }

  async findCompanyHistory(id: number) {
    return this.prisma.companyHistories.findUnique({ where: { id } });
  }

  async findCompanyList({ start, limit }: { start: number; limit: number }) {
    return this.prisma.companys.findMany({
      where: { id: { gte: start } },
      skip: limit,
      orderBy: { id: "asc" },
    });
  }

  async createCompanyHistory(companyId: number, data: CreateCompanyHistoryDto) {
    return this.prisma.companyHistories.create({
      data: { ...data, companyId },
    });
  }

  async updateCompanyHistory(id: number, data: UpdateCompanyHistoryDto) {
    return this.prisma.companyHistories.update({
      where: { id },
      data: { ...data },
    });
  }

  async test() {
    return true;
  }

  async createJobDescription(
    id: number,
    {
      jobDescription,
      jdDetails,
      jdWorkCondition,
      jdSteps,
      jdWelfares,
    }: ICreateJobDescription
  ) {
    // eslint-disable-next-line no-return-await
    return await this.prisma.$transaction(async (prisma) => {
      const jd = await prisma.jobDescriptions.create({
        data: { companyId: id, ...jobDescription },
      });

      const details = await Promise.all(
        jdDetails
          .map((e) => ({ jobDescriptionId: jd.id, ...e }))
          .map(async (jdDetail) =>
            prisma.jdDetails.create({ data: { ...jdDetail } })
          )
      );

      const workCondition = await prisma.jdWorkConditions.create({
        data: { jobDescriptionId: jd.id, ...jdWorkCondition },
      });

      const steps = await Promise.all(
        jdSteps
          .map((e) => ({ jobDescriptionId: jd.id, ...e }))
          .map((jdStep) => prisma.jdSteps.create({ data: { ...jdStep } }))
      );

      const welfares = await Promise.all(
        jdWelfares
          .map((e) => ({ jobDescriptionId: jd.id, ...e }))
          .map((jdWelfare) =>
            prisma.jdWelfares.create({ data: { ...jdWelfare } })
          )
      );

      return {
        jobDescription: jd,
        jdDetails: details,
        jdWorkCondition: workCondition,
        jdSteps: steps,
        jdWelfares: welfares,
      };
    });
  }

  async findJobDescriptionById(id: number) {
    return this.prisma.jobDescriptions.findUnique({
      where: { id },
      include: {
        jdDetails: true,
        jdWorkCondition: true,
        jdSteps: true,
        jdWelfares: true,
      },
    });
  }

  async createResumeApplying({
    userId,
    resumeId,
    jobDescriptionId,
  }: {
    userId: number;
    resumeId: number;
    jobDescriptionId: number;
  }) {
    return this.prisma.resumeApplyings.create({
      data: { userId, resumeId, jobDescriptionId },
    });
  }

  async findResumeApplyingByUserId(userId: number) {
    return this.prisma.resumeApplyings.findMany({
      where: { userId },
      include: {
        jobDescriptions: { include: { jdDetails: true } },
        resumes: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
