import { RowDataPacket } from "mysql2/promise";
import request from "supertest";
import Container from "typedi";
import { startApp } from "../../../app";
import { MySQL } from "../../../db";
import { newResumeFactory } from "../../../factory";
import { ResumeService, UserService } from "../../../services";

let userId = 0;
beforeAll(async () => {
  await Container.get(MySQL).connect();
});

beforeEach(async () => {
  const email = "ehgks0083@gmail.com";
  const userService = Container.get(UserService);

  const { user } = await userService.createUserBySocial(email);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userId = user.id;
});

afterEach(async () => {
  const conn = await Container.get(MySQL).getConnection();
  await conn!.query(`SET FOREIGN_KEY_CHECKS=0;`);
  const [rows] = await conn!.query<RowDataPacket[]>(`
      SELECT Concat('TRUNCATE TABLE ', TABLE_NAME, ';') as q
          FROM INFORMATION_SCHEMA.TABLES 
          WHERE table_schema = '${process.env.MYSQL_DATABASE}' AND table_type = 'BASE TABLE';
    `);

  for (const row of rows) {
    await conn!.query(row.q);
  }
  await conn!.query(`SET FOREIGN_KEY_CHECKS=1;`);
  conn?.release();
  jest.clearAllMocks();
});

afterAll(async () => {
  await Container.get(MySQL).closePool();
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
      newResumeFactory({
        resume: { title: "1번 이력서", content: "1번", is_public: true },
      })
    );

    await resumeService.createResume(
      userId,
      newResumeFactory({
        resume: { title: "2번 이력서", content: "2번", is_public: true },
      })
    );

    const res = await request(await startApp())
      .get(`${URL}`)
      .query(QUERY);

    expect(res.status).toBe(200);
  });
});
