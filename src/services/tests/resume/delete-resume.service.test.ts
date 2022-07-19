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

describe("deleteResume Test", () => {
  const userService = Container.get(UserService);
  const resumeService = Container.get(ResumeService);
  it("If success return affectedRows", async () => {
    const { user } = await userService.createUserBySocial(
      "ehgks0083@gmail.com"
    );
    const data = newResumeFactory();
    const {
      resume: { insertId },
    } = await resumeService.createResume(user.id, data);

    const spy = jest.spyOn(resumeService, "deleteResume");

    const [result] = await resumeService.deleteResume(insertId);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(insertId);

    expect(result.affectedRows).toBe(1);
  });
});
