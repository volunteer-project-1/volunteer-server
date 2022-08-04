import request from "supertest";
import Container from "typedi";
import { PrismaPromise } from "@prisma/client";
import { startApp } from "../../../app";
import { newResumeAllFactory } from "../../../factory";
import { ResumeService, UserService } from "../../../services";
import Prisma from "../../../db/prisma";

let prisma: typeof Prisma;
let userId: number;
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

  const { user } = await userService.createUserBySocial(email);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userId = user.id;
});

describe("findResumeById test", () => {
  const URL = "/api/v1/resume/public";
  const QUERY = { start: 1, limit: 5 };

  it("GET '/', if there is no query, return 404", async () => {
    const res = await request(await startApp()).get(`${URL}`);

    expect(res.status).toBe(404);
  });

  it("GET '/', if there is no limit (in valid query), return 404", async () => {
    const IN_VALID_QUERY = { start: 1 };
    const res = await request(await startApp())
      .get(`${URL}`)
      .query(IN_VALID_QUERY);

    expect(res.status).toBe(404);
  });

  it("GET '/', if there is no start (in valid query), return 404", async () => {
    const IN_VALID_QUERY = { limit: 1 };
    const res = await request(await startApp())
      .get(`${URL}`)
      .query(IN_VALID_QUERY);

    expect(res.status).toBe(404);
  });

  it("GET '/', If start is not a number (in valid query), return 400", async () => {
    const IN_VALID_QUERY = { start: "asdfasdf", limit: 5 };
    const res = await request(await startApp())
      .get(`${URL}`)
      .query(IN_VALID_QUERY);

    expect(res.status).toBe(400);
  });

  it("GET '/', If limit is not a number (in valid query), return 400", async () => {
    const IN_VALID_QUERY = { start: 1, limit: "asdfasdf" };
    const res = await request(await startApp())
      .get(`${URL}`)
      .query(IN_VALID_QUERY);

    expect(res.status).toBe(400);
  });

  it("GET '/', If Resume Not Founded, return 204", async () => {
    const res = await request(await startApp())
      .get(`${URL}`)
      .query(QUERY);

    expect(res.status).toBe(204);
  });

  it("GET '/', If Founded, return 200", async () => {
    const resumeService = Container.get(ResumeService);

    await resumeService.createResume(
      userId,
      newResumeAllFactory({
        resume: { title: "1번 이력서", content: "1번", isPublic: true },
      })
    );

    await resumeService.createResume(
      userId,
      newResumeAllFactory({
        resume: { title: "2번 이력서", content: "2번", isPublic: true },
      })
    );

    const res = await request(await startApp())
      .get(`${URL}`)
      .query(QUERY);

    expect(res.status).toBe(200);
  });
});
