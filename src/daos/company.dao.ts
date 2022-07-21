import { Service } from "typedi";
import { Prisma } from "../db";
import {
  CreateCompanyHistoryDto,
  UpdateCompanyDto,
  UpdateCompanyHistoryDto,
} from "../dtos";
import { IComapnyDAO, ICreateCompany, ICreateJobDescription } from "../types";

@Service()
export class CompanyDAO implements IComapnyDAO {
  constructor(private readonly prisma: Prisma) {}

  async createCompany({
    email,
    password,
    salt,
    name,
  }: ICreateCompany & { salt: string }) {
    return this.prisma.client.companys.create({
      data: {
        email,
        password,
        salt,
        name,
      },
    });
  }

  async updateCompany(companyId: number, data: UpdateCompanyDto) {
    return this.prisma.client.companys.update({
      where: { id: companyId },
      data: { ...data },
    });
  }

  async findCompanyByEmail(email: string) {
    return this.prisma.client.companys.findUnique({ where: { email } });
  }

  async findCompanyById(id: number) {
    return this.prisma.client.companys.findUnique({ where: { id } });
  }

  async findCompanyHistory(id: number) {
    return this.prisma.client.companyHistories.findUnique({ where: { id } });
  }

  async findCompanyList({ start, limit }: { start: number; limit: number }) {
    return this.prisma.client.companys.findMany({
      where: { id: { gte: start } },
      skip: limit,
      orderBy: { id: "asc" },
    });
  }

  async createCompanyHistory(companyId: number, data: CreateCompanyHistoryDto) {
    return this.prisma.client.companyHistories.create({
      data: { ...data, companyId },
    });
  }

  async updateCompanyHistory(id: number, data: UpdateCompanyHistoryDto) {
    return this.prisma.client.companyHistories.update({
      where: { id },
      data: { ...data },
    });
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
    return await this.prisma.client.$transaction(async (prisma) => {
      const jd = await prisma.jobDescriptions.create({
        data: { companyId: id, ...jobDescription },
      });
      //   const details = await prisma.jdDetails.createMany({
      //     data: [...jdDetails.map((e) => ({ jobDescriptionId: jd.id, ...e }))],
      //   });

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

      //   await prisma.jdSteps.createMany({
      //     data: [
      //       ...jdSteps.map((e) => ({
      //         jobDescriptionId: jd.id,
      //         ...e,
      //       })),
      //     ],
      //   });

      const steps = await Promise.race(
        jdSteps
          .map((e) => ({ jobDescriptionId: jd.id, ...e }))
          .map((jdStep) => prisma.jdSteps.create({ data: { ...jdStep } }))
      );

      //   await prisma.jdWelfares.createMany({
      //     data: [
      //       ...jdWelfares.map((e) => ({
      //         jobDescriptionId: jd.id,
      //         ...e,
      //       })),
      //     ],
      //   });

      const welfares = await Promise.race(
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
    return this.prisma.client.jobDescriptions.findUnique({
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
    jdDetailId,
  }: {
    userId: number;
    resumeId: number;
    jdDetailId: number;
  }) {
    return this.prisma.client.resumeApplyings.create({
      data: { userId, resumeId, jdDetailId },
    });
  }

  async findResumeApplyingByUserId(userId: number) {
    return this.prisma.client.resumeApplyings.findMany({
      where: { userId },
      include: {
        jdDetails: { include: { jobDescriptions: true } },
        resumes: true,
      },
    });

    // const conn = await this.mysql.getConnection();

    // const subQuery = `
    //     SELECT
    //         ra.id resume_applying_id,
    //         detail.job_description_id job_description_id,
    //         detail.id detail_id,
    //         detail.role role,
    //         resume.id resume_id,
    //         resume.title resume_title,
    //         ra.created_at created_at
    //     FROM
    //         ${RESUME_APPLYING_TABLE} AS ra
    //     JOIN ${JD_DETAIL_TABLE} AS detail
    //         ON detail.id = ra.jd_detail_id
    //     JOIN ${RESUME_TABLE} AS resume
    //         ON resume.id = ra.resume_id
    //     WHERE
    //         ra.user_id = ?
    //     GROUP BY resume_applying_id
    //     ORDER BY ra.created_at desc
    // `;

    // const query = `
    //     SELECT
    //         jobd.id job_description_id,
    //         q.*
    //     FROM
    //         ${JOB_DESCRIPTION_TABLE} jobd
    //     JOIN (${subQuery}) AS q
    //         ON q.job_description_id = jobd.id
    //     GROUP BY q.resume_applying_id

    // `;
    // const [rows] = await findOneOrWhole({ query, values: [userId] }, conn)();

    // if (!rows.length) {
    //   return undefined;
    // }

    // return rows;
  }
}
