/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { RowDataPacket } from "mysql2/promise";
import { Container } from "typedi";
import { MySQL } from "../../../db";
import { ResumeService, UserService } from "../..";
import { newResumeFactory } from "../../../factory";

let userId = 0;
beforeAll(async () => {
  await Container.get(MySQL).connect();
});

beforeEach(async () => {
  const email = "ehgks0083@gmail.com";

  const userService = Container.get(UserService);

  const { user } = await userService.createUserBySocial(email);

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

describe("findPublicResumes Test", () => {
  const resumeService = Container.get(ResumeService);

  it("if there are not public resumes, return undefined", async () => {
    const spy = jest.spyOn(resumeService, "findPublicResumes");
    const pageNation = {
      start: 1,
      limit: 5,
    };
    const results = await resumeService.findPublicResumes(pageNation);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(pageNation);

    expect(results).toBe(undefined);
  });

  it("if there are public resumes, return resumes", async () => {
    const data = newResumeFactory();
    await resumeService.createResume(userId, data);

    const spy = jest.spyOn(resumeService, "findPublicResumes");
    const pageNation = {
      start: 1,
      limit: 5,
    };
    const results = await resumeService.findPublicResumes(pageNation);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(pageNation);

    expect(results!.length).toBeLessThan(pageNation.limit + 1);
  });

  it("if there are public resumes, return resumes up to 5", async () => {
    const pageNation = {
      start: 1,
      limit: 5,
    };
    const addOneToLimitArr = Array.from(
      new Array(pageNation.limit),
      (_, i) => i + 1
    );

    for (const i of addOneToLimitArr) {
      await resumeService.createResume(
        userId,
        newResumeFactory({
          resume: { title: `${i}`, content: "내용", is_public: true },
        })
      );
    }

    const spy = jest.spyOn(resumeService, "findPublicResumes");

    const results = await resumeService.findPublicResumes(pageNation);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(pageNation);

    expect(results!.length).toBeLessThan(pageNation.limit + 1);
  });
});
