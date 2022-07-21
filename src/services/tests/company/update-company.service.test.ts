/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container } from "typedi";
import { PrismaPromise } from "@prisma/client";
import { Prisma } from "../../../db";
import { CompanyService } from "../..";
import { UpdateCompanyDto } from "../../../dtos";
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

describe("update-company Test", () => {
  const companyService = Container.get(CompanyService);
  //   it("If duplicated created, return company", async () => {
  //     const data: ICreateCompany = {
  //       email: "company@gmail.com",
  //       password: "company",
  //       name: "회사명",
  //     };

  //     const spy = jest.spyOn(companyService, "createCompany");

  //     await companyService.createCompany(data);
  //     try {
  //       await companyService.createCompany(data);
  //       throw new BadReqError("You Should not reach this");
  //     } catch (e) {
  //       expect(spy).toBeCalled();
  //       expect(spy).toBeCalledWith(data);

  //       //   expect(e.message).toEqual(expect.stringContaining("Duplicate"));
  //       expect(e).not.toBeInstanceOf(BadReqError);
  //     }
  //   });

  it("If created, return company", async () => {
    const data: ICreateCompany = {
      email: "company@gmail.com",
      password: "company",
      name: "회사명",
    };

    const company = await companyService.createCompany(data);

    const spy = jest.spyOn(companyService, "updateCompany");
    const updateData: UpdateCompanyDto = {
      name: "회사명2",
      introduce: "회사 소개~",
    };

    const updatedCompany = await companyService.updateCompany(
      company.id,
      updateData
    );

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(company.id, updateData);

    expect(updatedCompany).toEqual(expect.objectContaining(updateData));
  });
});
