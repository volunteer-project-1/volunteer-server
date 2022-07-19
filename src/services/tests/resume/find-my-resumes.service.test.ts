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

describe("findMyResumes Test", () => {
  const userService = Container.get(UserService);
  const resumeService = Container.get(ResumeService);
  it("return undefined", async () => {
    const { user } = await userService.createUserBySocial(
      "ehgks0083@gmail.com"
    );
    const data = newResumeFactory();
    await resumeService.createResume(user.id, data);

    const spy = jest.spyOn(resumeService, "findMyResumes");

    const results = await resumeService.findMyResumes(user.id);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(user.id);

    expect(results!.length).toBeLessThan(11);

    // expect(results.title).toBe(data.resume.title);
    // expect(results.content).toBe(data.resume.content);

    // expect(results.activities).toEqual(
    //   expect.arrayContaining(
    //     data.activities.map((activity) => expect.objectContaining(activity))
    //   )
    // );
  });
});
