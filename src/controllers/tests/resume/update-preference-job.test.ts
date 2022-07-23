import request from "supertest";
import Container from "typedi";
import { PrismaPromise } from "@prisma/client";
import { startApp } from "../../../app";
import { newPreferenceJobFactory, newResumeAllFactory } from "../../../factory";
import { ResumeService, UserService } from "../../../services";
import Prisma from "../../../db/prisma";

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

beforeEach(async () => {
  const email = "ehgks0083@gmail.com";

  const userService = Container.get(UserService);
  const resumeService = Container.get(ResumeService);

  const { user } = await userService.createUserBySocial(email);
  await resumeService.createResume(user.id, newResumeAllFactory());
});

describe("updatePreferenceJob test", () => {
  const URL = "/api/v1/resume";
  const concatURL = "preference-job";

  it("PATCH '/', If Resume Not Founded, return 400", async () => {
    const resumeInfoId = "un-valid-id";
    const res = await request(await startApp()).patch(
      `${URL}/${resumeInfoId}/${concatURL}`
    );

    expect(res.status).toBe(400);
  });

  it("PATCH '/', If Body Not Founded, return 400", async () => {
    const resumeInfoId = 1;

    const res = await request(await startApp()).patch(
      `${URL}/${resumeInfoId}/${concatURL}`
    );

    expect(res.status).toBe(400);
  });

  it("PATCH '/', If Founded, return 200", async () => {
    const resumeInfoId = 1;

    const res = await request(await startApp())
      .patch(`${URL}/${resumeInfoId}/${concatURL}`)
      .send({ preferenceJob: newPreferenceJobFactory() });

    expect(res.status).toBe(200);
  });
});
