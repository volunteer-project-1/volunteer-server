import { RowDataPacket } from "mysql2/promise";
import request from "supertest";
import Container from "typedi";
import { startApp } from "../../../app";
import { MySQL } from "../../../db";
import { CreateResumeDto } from "../../../dtos";
import { newResumeFactory } from "../../../factory";
import { UserService } from "../../../services";
import { convertDateToTimestamp } from "../../../utils";

beforeAll(async () => {
  await Container.get(MySQL).connect();
});

beforeEach(async () => {
  const email = "ehgks0083@gmail.com";

  const userService = Container.get(UserService);
  await userService.createUserBySocial(email);
});

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

  it("GET '/',If Validate Fail, return 400", async () => {
    const res = await request(await startApp())
      .post(URL)
      .send({ resume: { title: "제목", content: "내용" }, resumeInfo: {} });

    expect(res.status).toBe(400);
  });

  it("GET '/',If Created(필수항목), return 204", async () => {
    const data: CreateResumeDto = {
      resume: { title: "레쥬메1", content: "블라블라 내용", is_public: true },
      resumeInfo: {
        name: "홍길동",
        birthday: convertDateToTimestamp(),
        phone_number: "010-1234-5678",
        email: "test@gmail.com",
        sido: "서울시",
        sigungu: "강서구",
        sex: "남",
      },
      myVideo: { url: "url.link.com" },
    };
    const res = await request(await startApp())
      .post(URL)
      .send(data);

    expect(res.status).toBe(204);
  });

  it("GET '/',If Created(전체항목), return 204", async () => {
    const res = await request(await startApp())
      .post(URL)
      .send(newResumeFactory());

    expect(res.status).toBe(204);
  });
});
