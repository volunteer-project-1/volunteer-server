/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { RowDataPacket } from "mysql2/promise";
import { Container } from "typedi";
import { MySQL } from "../../../db";
import { ResumeService, UserService } from "../..";
import { newResumeFactory } from "../../../factory";
import { IUpdateHelperVideo } from "../../../types";

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

describe("updateHelperVideo Test", () => {
  const userService = Container.get(UserService);
  const resumeService = Container.get(ResumeService);
  it("If success return changedRows", async () => {
    const {
      user: { insertId },
    } = await userService.createUserBySocial("ehgks0083@gmail.com");
    const data = newResumeFactory();
    await resumeService.createResume(insertId, data);

    const spy = jest.spyOn(resumeService, "updateHelperVideo");

    const updatedData: IUpdateHelperVideo = {
      helperVideo: { url: "수정된 url" },
    };

    const [result] = await resumeService.updateHelperVideo(
      insertId,
      updatedData
    );

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(insertId, updatedData);
    expect(result.changedRows).toBe(1);
  });
});
