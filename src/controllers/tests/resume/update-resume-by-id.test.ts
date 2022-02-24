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

describe("updateResumeById test", () => {
  const URL = "/api/v1/resume";

  it("PATCH '/', If Resume Not Founded, return 401", async () => {
    const resumeId = "un-valid-id";
    const res = await request(await startApp()).patch(`${URL}/${resumeId}`);

    expect(res.status).toBe(401);
  });

  it("PATCH '/', If Body Not Founded, return 401", async () => {
    const email = "ehgks0083@gmail.com";

    const userService = Container.get(UserService);
    const resumeService = Container.get(ResumeService);

    const {
      user: { insertId },
    } = await userService.createUserBySocial(email);
    const {
      resume: { insertId: resumeId },
    } = await resumeService.createResume(insertId, newResumeFactory());

    const res = await request(await startApp()).patch(`${URL}/${resumeId}`);

    expect(res.status).toBe(401);
  });

  it("PATCH '/', If Founded, return 204", async () => {
    const email = "ehgks0083@gmail.com";

    const userService = Container.get(UserService);
    const resumeService = Container.get(ResumeService);

    const {
      user: { insertId },
    } = await userService.createUserBySocial(email);
    const {
      resume: { insertId: resumeId },
    } = await resumeService.createResume(insertId, newResumeFactory());

    const res = await request(await startApp())
      .patch(`${URL}/${resumeId}`)
      .send({ resume: { title: "수정된 제목" } });

    expect(res.status).toBe(204);
  });
});
