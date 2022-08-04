import { PrismaPromise } from "@prisma/client";
import request from "supertest";
import Container from "typedi";
import { startApp } from "../../../app";
import Prisma from "../../../db/prisma";
import { UserService } from "../../../services";

let prisma: typeof Prisma;
beforeAll(async () => {
  prisma = Prisma;
  await prisma.$connect();
});

beforeEach(async () => {
  const userService = Container.get(UserService);
  const email = "ehgks0083@gmail.com";

  await userService.createUserBySocial(email);
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

describe("findUserById test", () => {
  const URL = "/api/v1/user";

  it("GET '/:id',If Unvalid Id, return 400", async () => {
    const id = "unvalid-id";
    const res = await request(await startApp()).get(`${URL}/${id}`);

    expect(res.status).toBe(400);
  });

  it("GET '/:id',If User Not Founded return 404", async () => {
    const id = 2;
    const res = await request(await startApp()).get(`${URL}/${id}`);

    expect(res.status).toBe(404);
  });

  it("GET '/:id',If User Founded return 204", async () => {
    const id = 1;
    const res = await request(await startApp()).get(`${URL}/${id}`);

    expect(res.status).toBe(200);
  });
});
