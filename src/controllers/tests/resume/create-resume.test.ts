import { RowDataPacket } from "mysql2/promise";
import request from "supertest";
import Container from "typedi";
import { startApp } from "../../../app";
import { MySQL } from "../../../db";
import { newResumeFactory } from "../../../factory";
import { UserService } from "../../../services";

beforeAll(async () => {
  await Container.get(MySQL).connect();
});

// beforeEach(async () => {
//   const email = "ehgks0083@gmail.com";

//   const userService = Container.get(UserService);
//   await userService.createUser(email);
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

describe("createResume test", () => {
  const URL = "/api/v1/resume";

  //   it("GET '/', If Un Valid Body, return 401", async () => {
  //     const email = "ehgks0083@gmail.com";

  //     const userService = Container.get(UserService);
  //     await userService.createUser(email);

  //     const res = await request(await startApp())
  //       .post(URL)
  //       .send({ resume: { title: "이력서 제목" } });

  //     expect(res.status).toBe(401);
  //   });

  it("GET '/',If Created, return 204", async () => {
    const email = "ehgks0083@gmail.com";

    const userService = Container.get(UserService);
    await userService.createUserBySocial(email);

    const res = await request(await startApp())
      .post(URL)
      .send({ resume: { title: "제목", content: "내용" }, resumeInfo: {} });

    expect(res.status).toBe(401);
  });

  it("GET '/',If Created, return 204", async () => {
    const email = "ehgks0083@gmail.com";

    const userService = Container.get(UserService);
    await userService.createUserBySocial(email);

    const res = await request(await startApp())
      .post(URL)
      .send(newResumeFactory());

    expect(res.status).toBe(204);
  });
});
