/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { RowDataPacket } from "mysql2/promise";
import { Container } from "typedi";
import { MySQL } from "../../../db";
import { CompanyService } from "../..";
import { ResumeService } from "../../resume.service";
import {
  newCompanyJobDescriptionFactory,
  newResumeFactory,
} from "../../../factory";
import { UserService } from "../../user.service";
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

describe("find-resume-applying Test", () => {
  const userService = Container.get(UserService);
  const companyService = Container.get(CompanyService);
  const resumeService = Container.get(ResumeService);

  it("조회 성공 시, 반환", async () => {
    const userEmail = "user@gmail.com";
    const { user } = await userService.createUserBySocial(userEmail);

    const data: ICreateCompany = {
      email: "company@gmail.com",
      password: "company",
      name: "회사명",
    };

    const company = await companyService.createCompany(data);

    const { jdDetails, jobDescription } =
      await companyService.createJobDescription(
        company.insertId,
        newCompanyJobDescriptionFactory()
      );
    const { resume } = await resumeService.createResume(
      user.id,
      newResumeFactory()
    );

    const { jdDetails: jdDetails2, jobDescription: jobDescription2 } =
      await companyService.createJobDescription(
        company.insertId,
        newCompanyJobDescriptionFactory()
      );
    const { resume: resume2 } = await resumeService.createResume(user.id, {
      ...newResumeFactory(),
      resume: { title: "제목2", content: "내용2", is_public: true },
    });

    const resumeApplying = await companyService.createResumeApplying({
      userId: user.id,
      resumeId: resume.insertId,
      jdDetailId: jdDetails[0].insertId,
    });

    const resumeApplying2 = await companyService.createResumeApplying({
      userId: user.id,
      resumeId: resume2.insertId,
      jdDetailId: jdDetails2[1].insertId,
    });

    const r1 = {
      resume_applying_id: resumeApplying.insertId,
      resume_id: resume.insertId,
      detail_id: jdDetails[0].insertId,
      job_description_id: jobDescription.insertId,
    };

    const r2 = {
      resume_applying_id: resumeApplying2.insertId,
      resume_id: resume2.insertId,
      detail_id: jdDetails2[1].insertId,
      job_description_id: jobDescription2.insertId,
    };

    const arr = [r2, r1];

    const spy = jest.spyOn(companyService, "findResumeApplying");

    const founds = await companyService.findResumeApplying(user.id);

    if (!founds || !founds.length) {
      throw new Error();
    }

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(user.id);

    for (const [index, value] of founds.entries()) {
      expect(value).toEqual(expect.objectContaining(arr[index]));
    }
  });
});
