import { RowDataPacket } from "mysql2/promise";
import request from "supertest";
import Container from "typedi";
import { startApp } from "../../../app";
import { MySQL } from "../../../db";
import { newResumeFactory } from "../../../factory";
import { ResumeService, UserService } from "../../../services";

beforeAll(async () => {
  await Container.get(MySQL).connect();
});

// beforeEach(async () => {
//   const email = "ehgks0083@gmail.com";

//   const userService = Container.get(UserService);
//   const resumeService = Container.get(ResumeService);

//   const {
//     user: { insertId },
//   } = await userService.createUser(email);
//   await resumeService.createResume(insertId, newResumeFactory());
// });

afterEach(async () => {
  const conn = await Container.get(MySQL).getConnection();
  await conn!.query(`SET FOREIGN_KEY_CHECKS=0;`);
  const [rows] = await conn!.query<RowDataPacket[]>(`
      SELECT Concat('TRUNCATE TABLE ', TABLE_NAME, ';') as q
          FROM INFORMATION_SCHEMA.TABLES 
          WHERE table_schema = 'test' AND table_type = 'BASE TABLE';
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
  const URL = "/api/v1/resume";

  it("GET '/', If Resume Not Founded, return 204", async () => {
    const res = await request(await startApp()).get(`${URL}`);

    // expect(res.body).toBe({ message: "이력서 없음" });
    expect(res.status).toBe(204);
  });

  it("GET '/', If Founded, return 200", async () => {
    const email = "ehgks0083@gmail.com";

    const userService = Container.get(UserService);
    const resumeService = Container.get(ResumeService);

    const {
      user: { insertId },
    } = await userService.createUserBySocial(email);
    await resumeService.createResume(
      insertId,
      newResumeFactory({
        resume: { title: "1번 이력서", content: "1번", is_public: true },
      })
    );

    await resumeService.createResume(
      insertId,
      newResumeFactory({
        resume: { title: "2번 이력서", content: "2번", is_public: true },
      })
    );

    const res = await request(await startApp()).get(`${URL}`);

    expect(res.status).toBe(200);
  });
});
