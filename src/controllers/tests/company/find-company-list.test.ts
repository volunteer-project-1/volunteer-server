import request from "supertest";
import Container from "typedi";
import { PrismaPromise } from "@prisma/client";
import { startApp } from "../../../app";
import { Prisma } from "../../../db";
import { ICompany } from "../../../types";
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

describe("findCompanyList test", () => {
  const URL = "/api/v1/company";

  const companyService = Container.get(CompanyService);

  it("GET '/', If Query not exists return 400", async () => {
    const res = await request(await startApp()).get(`${URL}`);

    expect(res.status).toBe(404);
  });

  it("GET '/', If Query not a number return 400", async () => {
    const QUERY = { start: "un-valid-query", limit: 4 };
    const res = await request(await startApp())
      .get(`${URL}`)
      .query(QUERY);

    expect(res.status).toBe(400);
  });

  it("GET '/', If company not exist return 204", async () => {
    const QUERY = { start: 1, limit: 4 };

    const res = await request(await startApp())
      .get(`${URL}`)
      .query(QUERY);

    expect(res.status).toBe(204);
  });

  it("GET '/', If company exist return 200", async () => {
    const QUERY = { start: 1, limit: 4 };
    jest
      .spyOn(companyService, "findCompanyList")
      .mockResolvedValue([] as ICompany[]);

    const res = await request(await startApp())
      .get(`${URL}`)
      .query(QUERY);

    expect(res.status).toBe(200);
  });
});
