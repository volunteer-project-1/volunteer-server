import request from "supertest";
import Container from "typedi";
import { PrismaPromise } from "@prisma/client";
import { startApp } from "../../../app";
import { newResumeAllFactory } from "../../../factory";
import { UserService } from "../../../services";
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
describe("createResume test", () => {
  const URL = "/api/v1/resume";

  it("GET '/',If Validate Fail, return 400", async () => {
    const res = await request(await startApp())
      .post(URL)
      .send({ resume: { title: "제목", content: "내용" }, resumeInfo: {} });

    expect(res.status).toBe(400);
  });

  it("GET '/',If Created(필수항목), return 204", async () => {
    const data = newResumeAllFactory({
      helperVideo: null,
      educations: null,
      careers: null,
      trainings: null,
      certificates: null,
      preference: null,
      portfolio: null,
      introductions: null,
      awards: null,
    });
    const res = await request(await startApp())
      .post(URL)
      .send(data);

    expect(res.status).toBe(204);
  });

  it("GET '/',If Created(전체항목), return 204", async () => {
    const res = await request(await startApp())
      .post(URL)
      .send(newResumeAllFactory());

    expect(res.status).toBe(204);
  });
});
