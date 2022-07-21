/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container } from "typedi";
import { PrismaPromise } from "@prisma/client";
import { Prisma } from "../../../db";
import { CompanyService } from "../..";
import { newCompanyJobDescriptionFactory } from "../../../factory";
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

describe("find-company-job-description Test", () => {
  const companyService = Container.get(CompanyService);

  it("jobDescription 조회 실패시 null 반환", async () => {
    const spy = jest.spyOn(companyService, "findJobDescriptionById");
    const IN_VALID_JD_ID = 123;

    const found = await companyService.findJobDescriptionById(IN_VALID_JD_ID);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(IN_VALID_JD_ID);
    expect(found).toBeNull();
  });

  it("If created, return FindJobDescriptionDto", async () => {
    const data: ICreateCompany = {
      email: "company@gmail.com",
      password: "company",
      name: "회사명",
    };
    const company = await companyService.createCompany(data);

    const jdData = newCompanyJobDescriptionFactory();
    const { jobDescription } = await companyService.createJobDescription(
      company.id,
      jdData
    );
    const spy = jest.spyOn(companyService, "findJobDescriptionById");

    const found = await companyService.findJobDescriptionById(
      jobDescription.id
    );
    if (!found) {
      throw new Error();
    }

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(jobDescription.id);

    expect(found.jdWorkCondition[0]).toEqual(
      expect.objectContaining(jdData.jdWorkCondition)
    );

    expect(found.jdDetails).toEqual(
      expect.arrayContaining(
        jdData.jdDetails.map((detail) => expect.objectContaining(detail))
      )
    );

    expect(found.jdSteps).toEqual(
      expect.arrayContaining(
        jdData.jdSteps.map((step) => expect.objectContaining(step))
      )
    );

    expect(found.jdWelfares).toEqual(
      expect.arrayContaining(
        jdData.jdWelfares.map((welfare) => expect.objectContaining(welfare))
      )
    );
  });
});
