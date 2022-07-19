/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { RowDataPacket } from "mysql2/promise";
import { Container } from "typedi";
import { MySQL } from "../../../db";
import { ResumeService, UserService } from "../..";
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

describe("findResumeById Test", () => {
  const userService = Container.get(UserService);
  const resumeService = Container.get(ResumeService);
  it("필수항목, return Resume", async () => {
    const id = 1;

    const { user } = await userService.createUserBySocial(
      "ehgks0083@gmail.com"
    );
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

    await resumeService.createResume(user.id, data);

    const spy = jest.spyOn(resumeService, "findResumeById");

    const result = await resumeService.findResumeById(id);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(id);

    expect(result.resume_info).not.toBeNull();
    expect(result.myVidoe).not.toBeNull();
    expect(result).not.toBeNull();
  });

  it("return Resume", async () => {
    const id = 1;

    const { user } = await userService.createUserBySocial(
      "ehgks0083@gmail.com"
    );
    const data = newResumeFactory();
    await resumeService.createResume(user.id, data);

    const spy = jest.spyOn(resumeService, "findResumeById");

    const result = await resumeService.findResumeById(id);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(id);

    expect(result).not.toBeNull();
  });
});
