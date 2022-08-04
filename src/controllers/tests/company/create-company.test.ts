import { PrismaPromise } from "@prisma/client";
import request from "supertest";
import { startApp } from "../../../app";
import Prisma from "../../../db/prisma";
import { CreateCompanyByLocalDto } from "../../../dtos";

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

describe("create company api test", () => {
  const URL = "/api/v1/auth/local/signup/company";

  //   const companyService = Container.get(CompanyService);

  it("body dto in valid, return 400", async () => {
    const res = await request(await startApp())
      .post(`${URL}`)
      .send({});

    expect(res.status).toBe(400);
  });

  it("if passwordConfirm not valid, return 200", async () => {
    const body: CreateCompanyByLocalDto = {
      email: "company@gmail.com",
      password: "comcomcomcom123!A.",
      passwordConfirm: "comcomcomcom",
      name: "회사명",
    };
    const res = await request(await startApp())
      .post(`${URL}`)
      .send(body);

    expect(res.status).toBe(400);
  });

  it("if success, return 200", async () => {
    const body: CreateCompanyByLocalDto = {
      email: "company@gmail.com",
      password: "comcomcomcom123!A.",
      passwordConfirm: "comcomcomcom123!A.",
      name: "회사명",
    };
    const res = await request(await startApp())
      .post(`${URL}`)
      .send(body);

    expect(res.status).toBe(200);
  });
});
