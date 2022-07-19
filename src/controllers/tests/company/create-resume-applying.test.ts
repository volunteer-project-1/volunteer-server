import { RowDataPacket } from "mysql2/promise";
import request from "supertest";
import Container from "typedi";
import { startApp } from "../../../app";
import { MySQL } from "../../../db";
import {
  newCompanyJobDescriptionFactory,
  newResumeFactory,
} from "../../../factory";
import { CompanyService, ResumeService, UserService } from "../../../services";
import { ICreateCompany } from "../../../types";

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

describe("create-resume-applying api test", () => {
  const URL = "/api/v1/company/applying";
  const userService = Container.get(UserService);
  const resumeService = Container.get(ResumeService);
  const companyService = Container.get(CompanyService);

  it("In valid query string, return 400", async () => {
    const query = { invalid: "asdf" };
    const res = await request(await startApp())
      .post(`${URL}`)
      .query(query);

    expect(res.status).toBe(400);
  });

  it("if success, return 200", async () => {
    const { user } = await userService.createUserBySocial("user@gmail.com");
    const data: ICreateCompany = {
      email: "company@gmail.com",
      password: "company",
      name: "회사명",
    };
    const { resume } = await resumeService.createResume(
      user.id,
      newResumeFactory()
    );

    const company = await companyService.createCompany(data);
    const { jdDetails } = await companyService.createJobDescription(
      company.insertId,
      newCompanyJobDescriptionFactory()
    );

    const query = {
      resumeId: resume.insertId,
      jdDetailId: jdDetails[0].insertId,
    };
    const res = await request(await startApp())
      .post(`${URL}`)
      .query(query);

    expect(res.status).toBe(200);
  });
});
