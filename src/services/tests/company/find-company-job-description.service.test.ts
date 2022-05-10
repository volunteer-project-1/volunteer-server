/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { RowDataPacket } from "mysql2/promise";
import { Container } from "typedi";
import { MySQL } from "../../../db";
import { CompanyService } from "../..";
import { CreateCompanyByLocalDto } from "../../../dtos";
import { newCompanyJobDescriptionFactory } from "../../../factory";
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

describe("find-company-job-description Test", () => {
  const companyService = Container.get(CompanyService);

  it("jobDescription 조회 실패시 undefined 반환", async () => {
    const spy = jest.spyOn(companyService, "findJobDescriptionById");
    const IN_VALID_JD_ID = 123;

    const found = await companyService.findJobDescriptionById(IN_VALID_JD_ID);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(IN_VALID_JD_ID);
    expect(found).toBe(undefined);
  });

  it("If created, return FindJobDescriptionDto", async () => {
    const data: ICreateCompany = {
      email: "company@gmail.com",
      password: "company",
      name: "회사명",
    };
    const company = await companyService.createCompany(data);

    const jdData = newCompanyJobDescriptionFactory();
    const { jobDescription } = await companyService.createJobDescription(
      company.insertId,
      jdData
    );
    const spy = jest.spyOn(companyService, "findJobDescriptionById");

    const found = await companyService.findJobDescriptionById(
      jobDescription.insertId
    );
    if (!found) {
      throw new Error();
    }

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(jobDescription.insertId);

    expect(found.jd_work_condition).toEqual(
      expect.objectContaining(jdData.jd_work_condition)
    );

    expect(found.jd_details).toEqual(
      expect.arrayContaining(
        jdData.jd_details.map((detail) => expect.objectContaining(detail))
      )
    );

    expect(found.jd_steps).toEqual(
      expect.arrayContaining(
        jdData.jd_steps.map((step) => expect.objectContaining(step))
      )
    );

    expect(found.jd_welfares).toEqual(
      expect.arrayContaining(
        jdData.jd_welfares.map((welfare) => expect.objectContaining(welfare))
      )
    );
  });
});
