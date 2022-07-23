import { PrismaPromise } from "@prisma/client";
import request from "supertest";
import Container from "typedi";
import { startApp } from "../../../app";
import Prisma from "../../../db/prisma";
import { UpdateCompanyDto } from "../../../dtos";
import { CompanyService } from "../../../services";
import { ICreateCompany } from "../../../types";

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

describe("update company api test", () => {
  const URL = "/api/v1/company";

  const companyService = Container.get(CompanyService);

  it("body dto in valid, return 400", async () => {
    const body: UpdateCompanyDto = {};
    const res = await request(await startApp())
      .patch(URL)
      .send(body);

    expect(res.status).toBe(400);
  });

  it("if success, return 200", async () => {
    const data: ICreateCompany = {
      email: "company@gmail.com",
      password: "company",
      name: "회사명",
    };
    await companyService.createCompany(data);

    const body: UpdateCompanyDto = { name: " 회사명2" };
    const res = await request(await startApp())
      .patch(`${URL}`)
      .send(body);

    expect(res.status).toBe(200);
  });
});
