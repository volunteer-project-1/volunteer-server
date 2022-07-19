/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { RowDataPacket } from "mysql2/promise";
import { Container } from "typedi";
import { ResumeService, UserService } from "../..";
import { MySQL } from "../../../db";
import { newResumeFactory } from "../../../factory";
import { CreateResumeDto } from "../../../dtos";
import { convertDateToTimestamp } from "../../../utils";

beforeAll(async () => {
  await Container.get(MySQL).connect();
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

describe("createResume Test", () => {
  const userService = Container.get(UserService);
  const resumeService = Container.get(ResumeService);

  it("If success (필수항목) return {affectedRows: 1, serverStatus: 3}", async () => {
    const email = "ehgks0083@gmail.com";
    const { user } = await userService.createUserBySocial(email);

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

    const spy = jest.spyOn(resumeService, "createResume");

    const { resume } = await resumeService.createResume(user.id, data);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(user.id, data);

    expect(resume.insertId).toBe(1);
    expect(resume.affectedRows).toBe(1);
  });

  it("If success (전체항목) return {affectedRows: 1, serverStatus: 3}", async () => {
    const email = "ehgks0083@gmail.com";
    const { user } = await userService.createUserBySocial(email);

    const data = newResumeFactory();

    const spy = jest.spyOn(resumeService, "createResume");

    const { resume } = await resumeService.createResume(user.id, data);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(user.id, data);

    expect(resume.insertId).toBe(1);
    expect(resume.affectedRows).toBe(1);
  });
});
