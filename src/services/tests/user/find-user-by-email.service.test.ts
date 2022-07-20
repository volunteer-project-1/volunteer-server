/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { PrismaPromise } from "@prisma/client";
import { Container } from "typedi";
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

describe("findUserByEmail Test", () => {
  const userService = Container.get(UserService);
  it("If Not Found return undefined", async () => {
    const email = "ehgks0083@gmail.com";
    const spy = jest.spyOn(userService, "findUserByEmail");

    const result = await userService.findUserByEmail(email);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(email);
    expect(result).toBeNull();
  });

  it("returns IUser", async () => {
    const email = "ehgks00@gmail.com";
    await userService.createUserBySocial(email);

    const spy = jest.spyOn(userService, "findUserByEmail");

    const result = await userService.findUserByEmail(email);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(email);
    expect(result).toEqual(expect.objectContaining({ email }));
  });
});
