import request from "supertest";
import Container from "typedi";
import { PrismaPromise } from "@prisma/client";
import { startApp } from "../../../app";
import { newCareerFactory, newResumeAllFactory } from "../../../factory";
import { ResumeService, UserService } from "../../../services";
import Prisma from "../../../db/prisma";

beforeEach(async () => {
  const email = "ehgks0083@gmail.com";

  const userService = Container.get(UserService);
  await userService.createUserBySocial(email);
});

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
describe("create Career test", () => {
  const URL = "/api/v1/resume";

  const resumeService = Container.get(ResumeService);

  it("GET '/',If Validate fail, return 400", async () => {
    const resumeId = 1;

    const res = await request(await startApp())
      .post(`${URL}/${resumeId}/career`)
      .send({ test: "asdf" });

    expect(res.status).toBe(400);
  });

  it("GET '/',If No resume, return 404", async () => {
    const resumeId = 1;

    const res = await request(await startApp())
      .post(`${URL}/${resumeId}/career`)
      .send(newCareerFactory());

    expect(res.status).toBe(404);
  });

  it("GET '/',If Created, return 200", async () => {
    const userId = 1;
    const { resume } = await resumeService.createResume(
      userId,
      newResumeAllFactory()
    );
    const res = await request(await startApp())
      .post(`${URL}/${resume.id}/career`)
      .send(newCareerFactory());

    expect(res.status).toBe(200);
  });
});
