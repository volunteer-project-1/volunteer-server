import { PrismaPromise } from "@prisma/client";
import request from "supertest";
import Container from "typedi";
import { startApp } from "../../../app";
import { Prisma } from "../../../db";
import {
  newCompanyJobDescriptionFactory,
  newResumeFactory,
} from "../../../factory";
import { CompanyService, ResumeService, UserService } from "../../../services";
import { ICreateCompany } from "../../../types";

let prisma: Prisma;
beforeAll(async () => {
  prisma = Container.get(Prisma);
  await prisma.client.$connect();
});

afterEach(async () => {
  const transactions: PrismaPromise<any>[] = [];
  transactions.push(prisma.client.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`);

  const tablenames = await prisma.client.$queryRawUnsafe<
    Array<{ TABLE_NAME: string }>
  >(
    `SELECT TABLE_NAME from information_schema.TABLES WHERE TABLE_SCHEMA = '${process.env.MYSQL_DATABASE}';`
  );

  for (const { TABLE_NAME } of tablenames) {
    if (TABLE_NAME !== "_prisma_migrations") {
      try {
        transactions.push(
          prisma.client.$executeRawUnsafe(`TRUNCATE ${TABLE_NAME};`)
        );
      } catch (error) {
        console.log({ error });
      }
    }
  }

  transactions.push(prisma.client.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`);

  try {
    await prisma.client.$transaction(transactions);
  } catch (error) {
    console.log({ error });
  }

  jest.clearAllMocks();
});

afterAll(async () => {
  await prisma.client.$disconnect();
});

describe("find-resume-applying-by-user-id api test", () => {
  const URL = "/api/v1/company/applying";
  const userService = Container.get(UserService);
  const resumeService = Container.get(ResumeService);
  const companyService = Container.get(CompanyService);

  it("No resumeApplying, return 404", async () => {
    const res = await request(await startApp()).get(`${URL}`);

    expect(res.status).toBe(404);
  });

  it("if success, return 200", async () => {
    const { user } = await userService.createUserBySocial("user@gmail.com");
    const { resume } = await resumeService.createResume(
      user.id,
      newResumeFactory()
    );

    const data: ICreateCompany = {
      email: "company@gmail.com",
      password: "company",
      name: "회사명",
    };
    const company = await companyService.createCompany(data);

    const { jdDetails } = await companyService.createJobDescription(
      company.id,
      newCompanyJobDescriptionFactory()
    );

    await companyService.createResumeApplying({
      userId: user.id,
      resumeId: resume.insertId,
      jdDetailId: jdDetails[0].insertId,
    });

    const res = await request(await startApp()).get(`${URL}`);

    expect(res.status).toBe(200);
  });
});
