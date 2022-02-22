/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { RowDataPacket } from "mysql2/promise";
import { Container } from "typedi";
import { ResumeService, UserService } from "../..";
import { MySQL } from "../../../db";
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

describe("createResume Test", () => {
  const userService = Container.get(UserService);
  const resumeService = Container.get(ResumeService);
  it("If success return {affectedRows: 1, serverStatus: 3}", async () => {
    const email = "ehgks0083@gmail.com";
    const { user } = await userService.createUser(email);

    const data = newResumeFactory();

    const spy = jest.spyOn(resumeService, "createResume");

    const { resume } = await resumeService.createResume(user.insertId, data);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(user.insertId, data);

    expect(resume.insertId).toBe(user.insertId);
    expect(resume.affectedRows).toBe(1);
  });
});
