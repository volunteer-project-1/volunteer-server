import { PrismaPromise } from "@prisma/client";
import request from "supertest";
import Container from "typedi";
import { startApp } from "../../../app";
import { Prisma } from "../../../db";
import { UserService } from "../../../services";

beforeEach(async () => {
  const email = "ehgks0083@gmail.com";

  const userService = Container.get(UserService);
  await userService.createUserBySocial(email);
});

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
