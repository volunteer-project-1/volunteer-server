import { PrismaPromise } from "@prisma/client";
import request from "supertest";
import Container from "typedi";
import { startApp } from "../../../app";
import Prisma from "../../../db/prisma";
import {
  newCompanyJobDescriptionFactory,
  newResumeAllFactory,
} from "../../../factory";
import { CompanyService, ResumeService, UserService } from "../../../services";

let prisma: typeof Prisma;
beforeAll(async () => {
  prisma = Prisma;
  await prisma.$connect();
});

afterEach(async () => {
  const transactions: PrismaPromise<any>[] = [];
  transactions.push(prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`);

  const tablenames = await prisma.$queryRawUnsafe<
    Array<{ TABLE_NAME: string }>
  >(
    `SELECT TABLE_NAME from information_schema.TABLES WHERE TABLE_SCHEMA = '${process.env.MYSQL_DATABASE}';`
  );

  for (const { TABLE_NAME } of tablenames) {
    if (TABLE_NAME !== "_prisma_migrations") {
      try {
        transactions.push(prisma.$executeRawUnsafe(`TRUNCATE ${TABLE_NAME};`));
      } catch (error) {
        console.log({ error });
      }
    }
  }

  transactions.push(prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`);

  try {
    await prisma.$transaction(transactions);
  } catch (error) {
    console.log({ error });
  }

  jest.clearAllMocks();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("create-resume-applying api test", () => {
  const URL = "/api/v1/company/applying";
  const resumeService = Container.get(ResumeService);
  const companyService = Container.get(CompanyService);
  const userService = Container.get(UserService);

  it("In valid query string, return 400", async () => {
    const query = { invalid: "asdf" };
    const res = await request(await startApp())
      .post(`${URL}`)
      .query(query);

    expect(res.status).toBe(400);
  });

  it("if success, return 200", async () => {
    const { user } = await userService.createUserBySocial(
      "ehgks0083@gmail.com"
    );
    const { resume } = await resumeService.createResume(
      user.id,
      newResumeAllFactory()
    );

    const company = await companyService.createCompany({
      email: "company@gmail.com",
      password: "asdfa",
      name: "compnay",
    });

    const { jobDescription } = await companyService.createJobDescription(
      company.id,
      newCompanyJobDescriptionFactory()
    );

    const query = {
      resumeId: resume.id,
      jobDescriptionId: jobDescription.id,
    };

    const res = await request(await startApp())
      .post(`${URL}`)
      .query(query);

    expect(res.status).toBe(200);
  });
});
