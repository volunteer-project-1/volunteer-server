/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { RowDataPacket } from "mysql2/promise";
import { Container } from "typedi";
import { MySQL } from "../../../db";
import { ResumeService, UserService } from "../..";
import { newResumeFactory } from "../../../factory";

beforeAll(async () => {
  await Container.get(MySQL).connect();
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

describe("findResumeById Test", () => {
  const userService = Container.get(UserService);
  const resumeService = Container.get(ResumeService);
  it("return undefined", async () => {
    const id = 1;

    const { user } = await userService.createUser("ehgks0083@gmail.com");
    const data = newResumeFactory();
    await resumeService.createResume(user.insertId, data);

    const spy = jest.spyOn(resumeService, "findResumeById");

    const result = await resumeService.findResumeById(id);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(id);
    expect(result.title).toBe(data.resume.title);
    expect(result.content).toBe(data.resume.content);

    expect(result.activities).toEqual(
      expect.arrayContaining(
        data.activities.map((activity) => expect.objectContaining(activity))
      )
    );
  });
});
