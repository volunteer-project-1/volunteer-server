import request from "supertest";
import { PrismaPromise } from "@prisma/client";
import { Container } from "typedi";
import { startApp } from "../../../app";
import Prisma from "../../../db/prisma";
import { CompanyService } from "../../../services";

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

describe("findCompanyById test", () => {
  const URL = "/api/v1/company";

  const companyService = Container.get(CompanyService);

  it("GET '/', If Company ID not valid return 400", async () => {
    const id = "aslkdf";
    const res = await request(await startApp()).get(`${URL}/${id}/profile`);

    expect(res.status).toBe(400);
  });

  it("GET '/', If Company not exists return 404", async () => {
    const id = "2";
    const res = await request(await startApp()).get(`${URL}/${id}/profile`);

    expect(res.status).toBe(404);
  });

  it("GET '/', If My Company exists return 200", async () => {
    // company self profile
    await companyService.createCompany({
      email: "company@gmail.com",
      password: "test-pass",
      name: "company1",
    });
    const id = "me";
    const res = await request(await startApp()).get(`${URL}/${id}/profile`);

    expect(res.status).toBe(200);
  });

  it("GET '/', If My Company exist return 200", async () => {
    await companyService.createCompany({
      email: "company@gmail.com",
      password: "test-pass",
      name: "company1",
    });
    const id = "1";
    const res = await request(await startApp()).get(`${URL}/${id}/profile`);

    expect(res.status).toBe(200);
  });

  it("GET '/', If Another Company exist return 200", async () => {
    await companyService.createCompany({
      email: "my-company@gmail.com",
      password: "test-pass",
      name: "my company",
    });

    await companyService.createCompany({
      email: "another-company@gmail.com",
      password: "test-pass",
      name: "another company1",
    });

    const id = "2";
    const res = await request(await startApp()).get(`${URL}/${id}/profile`);

    expect(res.status).toBe(200);
  });
});
