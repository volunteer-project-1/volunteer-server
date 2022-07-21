/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container } from "typedi";
import { PrismaPromise } from "@prisma/client";
import { Prisma } from "../../../db";
import { CompanyService } from "../..";
import { ResumeService } from "../../resume.service";
import {
  newCompanyJobDescriptionFactory,
  newResumeFactory,
} from "../../../factory";
import { UserService } from "../../user.service";
import { ICreateCompany } from "../../../types";

let prisma: Prisma;
beforeAll(async () => {
  prisma = Container.get(Prisma);
  await prisma.client.$connect();
});

afterEach(async () => {
  const transactions: PrismaPromise<any>[] = [];
  transactions.push(prisma.client.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`);

  const tablenames = await prisma.client.$queryRawUnsafe<
    Array<{ TABLE_NAME: string }>
  >(
    `SELECT TABLE_NAME from information_schema.TABLES WHERE TABLE_SCHEMA = '${process.env.MYSQL_DATABASE}';`
  );

  for (const { TABLE_NAME } of tablenames) {
    if (TABLE_NAME !== "_prisma_migrations") {
      try {
        transactions.push(
          prisma.client.$executeRawUnsafe(`TRUNCATE ${TABLE_NAME};`)
        );
      } catch (error) {
        console.log({ error });
      }
    }
  }

  transactions.push(prisma.client.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`);

  try {
    await prisma.client.$transaction(transactions);
  } catch (error) {
    console.log({ error });
  }

  jest.clearAllMocks();
});

afterAll(async () => {
  await prisma.client.$disconnect();
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
        company.id,
        newCompanyJobDescriptionFactory()
      );
    const { resume } = await resumeService.createResume(
      user.id,
      newResumeFactory()
    );

    const { jdDetails: jdDetails2, jobDescription: jobDescription2 } =
      await companyService.createJobDescription(
        company.id,
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
