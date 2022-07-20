import { PrismaPromise } from "@prisma/client";
import request from "supertest";
import Container from "typedi";
import { startApp } from "../../../app";
import { Prisma } from "../../../db";
import { UserService } from "../../../services";

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

describe("findMyProfile test", () => {
  const URL = "/api/v1/user";

  it("GET '/profile',If My profile founded, return 200", async () => {
    // const email = "ehgks0083@gmail.com";

    // const userService = Container.get(UserService);
    // await userService.createUser(email);

    const res = await request(await startApp()).get(`${URL}/profile`);

    expect(res.status).toBe(404);
  });

  it("GET '/profile',If My profile founded, return 200", async () => {
    const email = "ehgks0083@gmail.com";

    const userService = Container.get(UserService);
    await userService.createUserBySocial(email);

    const res = await request(await startApp()).get(`${URL}/profile`);

    expect(res.status).toBe(200);
  });
});
