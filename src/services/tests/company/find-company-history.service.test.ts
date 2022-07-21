/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container } from "typedi";
import { PrismaPromise } from "@prisma/client";
import { Prisma } from "../../../db";
import { CompanyService } from "../..";
import { CreateCompanyHistoryDto } from "../../../dtos";
import { convertDateToTimestamp } from "../../../utils";
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

describe("find-Company-history Test", () => {
  const companyService = Container.get(CompanyService);

  it("If not found, return undefined", async () => {
    const spy = jest.spyOn(companyService, "findCompanyHistory");

    const results = await companyService.findCompanyHistory(1);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(1);

    expect(results).toBeNull();
  });

  it("조회 성공 시, 반환", async () => {
    const data: ICreateCompany = {
      email: "company@gmail.com",
      password: "company",
      name: "회사명",
    };
    const company = await companyService.createCompany(data);

    const companyHistoryData: CreateCompanyHistoryDto = {
      content: "연혁 1",
      history_at: convertDateToTimestamp(),
    };

    const companyHistory = await companyService.createCompanyHistory(
      company.id,
      companyHistoryData
    );

    const spy = jest.spyOn(companyService, "findCompanyHistory");

    const result = await companyService.findCompanyHistory(
      companyHistory.insertId
    );

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(companyHistory.insertId);

    expect(result).not.toBeNull();
  });
});
