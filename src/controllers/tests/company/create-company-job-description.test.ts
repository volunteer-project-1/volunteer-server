import { PrismaPromise } from "@prisma/client";
import request from "supertest";
import Container from "typedi";
import { startApp } from "../../../app";
import { Prisma } from "../../../db";
import { CreateCompanyByLocalDto } from "../../../dtos";
import { newCompanyJobDescriptionFactory } from "../../../factory";
import { CompanyService } from "../../../services";

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

describe("create-company-job-description api test", () => {
  const URL = "/api/v1/company";

  it("In Valid Params", async () => {
    const params = "IN-valid";
    const res = await request(await startApp()).post(
      `${URL}/${params}/job-description`
    );
    expect(res.status).toBe(400);
  });

  it("In valid body dto, return 400", async () => {
    const body = {};
    const res = await request(await startApp())
      .post(`${URL}/1/job-description`)
      .send(body);

    expect(res.status).toBe(400);
  });

  it("if success, return 200", async () => {
    const companyService = Container.get(CompanyService);
    const data: CreateCompanyByLocalDto = {
      email: "company@gmail.com",
      password: "comcomcomcom123!A.",
      passwordConfirm: "comcomcomcom123!A.",
      name: "회사명",
    };

    const body = newCompanyJobDescriptionFactory();

    const company = await companyService.createCompany(data);
    const res = await request(await startApp())
      .post(`${URL}/${company.id}/job-description`)
      .send(body);

    expect(res.status).toBe(200);
  });
});
