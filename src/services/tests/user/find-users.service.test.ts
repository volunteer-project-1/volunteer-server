/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container } from "typedi";
import { PrismaPromise } from "@prisma/client";
import { UserService } from "../..";
import { Prisma } from "../../../db";

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

describe("findUsers Test", () => {
  const userService = Container.get(UserService);
  it("If Not Found return empty array", async () => {
    const spy = jest.spyOn(userService, "findUsers");
    const query = { id: 0, limit: 5 };

    const results = await userService.findUsers(query);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(query);
    expect(results).toEqual([]);
  });

  it("If Not Found return users array", async () => {
    const email1 = "ehgks00@gmail.com";
    const email2 = "ehgks0083@gmail.com";
    await userService.createUserBySocial(email1);
    await userService.createUserBySocial(email2);

    const spy = jest.spyOn(userService, "findUsers");

    const query = { id: 0, limit: 5 };

    const results = await userService.findUsers(query);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(query);
    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ email: email2 }),
        expect.objectContaining({ email: email1 }),
      ])
    );
  });
});
