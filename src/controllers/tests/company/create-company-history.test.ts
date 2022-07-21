import { PrismaPromise } from "@prisma/client";
import request from "supertest";
import Container from "typedi";
import { startApp } from "../../../app";
import { Prisma } from "../../../db";
import {
  CreateCompanyByLocalDto,
  CreateCompanyHistoryDto,
} from "../../../dtos";
import { CompanyService } from "../../../services";
import { convertDateToTimestamp } from "../../../utils";

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

describe("create company history api test", () => {
  const URL = "/api/v1/company";

  const companyService = Container.get(CompanyService);

  it("in valid params, return 400", async () => {
    const params = "in-valid";
    const res = await request(await startApp()).post(
      `${URL}/${params}/history`
    );
    //   .send({});

    expect(res.status).toBe(400);
  });

  it("body dto in valid, return 400", async () => {
    const params = 1;
    const res = await request(await startApp())
      .post(`${URL}/${params}/history`)
      .send({});

    expect(res.status).toBe(400);
  });

  it("if success, return 200", async () => {
    const data: CreateCompanyByLocalDto = {
      email: "company@gmail.com",
      password: "comcomcomcom123!A.",
      passwordConfirm: "comcomcomcom123!A.",
      name: "회사명",
    };
    const company = await companyService.createCompany(data);

    const body: CreateCompanyHistoryDto = {
      content: "VC 투자 10억",
      history_at: convertDateToTimestamp(),
    };
    const res = await request(await startApp())
      .post(`${URL}/${company.id}/history`)
      .send(body);

    expect(res.status).toBe(200);
  });

  //   it("if success, return 200", async () => {
  //     const body: CreateCompanyByLocalDto = {
  //       email: "company@gmail.com",
  //       password: "comcomcomcom123!A.",
  //       passwordConfirm: "comcomcomcom123!A.",
  //     };
  //     const res = await request(await startApp())
  //       .post(`${URL}`)
  //       .send(body);

  //     expect(res.status).toBe(200);
  //   });
});
