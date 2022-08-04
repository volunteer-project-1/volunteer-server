/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  JdDetails,
  JobDescriptions,
  PrismaClient,
  ResumeApplyings,
  Resumes,
} from "@prisma/client";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import "reflect-metadata";
import { Container } from "typedi";
import { CompanyService } from "../..";
import Prisma from "../../../db/prisma";

jest.mock("../../../db/prisma", () => {
  return {
    __esModule: true,
    default: mockDeep<PrismaClient>(),
    // ...orig,
  };
});

beforeEach(() => {
  // eslint-disable-next-line no-use-before-define
  mockReset(prismaMock);
});

const prismaMock = Prisma as unknown as DeepMockProxy<PrismaClient>;

describe("find-resume-applying Test", () => {
  const companyService = Container.get(CompanyService);

  //   (ResumeApplyings & {
  //     jobDescriptions: JobDescriptions & {
  //         jdDetails: JdDetails[];
  //     };
  //     resumes: Resumes;
  // })[]

  it("조회 성공 시, Return ResumeApplyings", async () => {
    const userId = 1;

    const jobDescriptions_1: JobDescriptions = {
      id: 1,
      startedAt: new Date(),
      deadlineAt: new Date(),
      category: "데브옵스",
      companyId: 1,
    };

    const jobDescriptions_2: JobDescriptions = {
      id: 2,
      startedAt: new Date(),
      deadlineAt: new Date(),
      category: "프론트",
      companyId: 1,
    };

    const resumeApplying_1: ResumeApplyings = {
      id: 1,
      userId: 1,
      resumeId: 1,
      jobDescriptionId: jobDescriptions_1.id,
      createdAt: new Date(),
      deletedAt: null,
    };
    const resumeApplying_2: ResumeApplyings = {
      id: 2,
      userId: 1,
      resumeId: 1,
      jobDescriptionId: jobDescriptions_2.id,
      createdAt: new Date(),
      deletedAt: null,
    };

    const jdDetails_1: JdDetails = {
      id: 1,
      title: "",
      numRecruitment: 0,
      role: "개발",
      requirements: "cloud",
      priority: "aws",
      jobDescriptionId: jobDescriptions_1.id,
    };

    const jdDetails_2: JdDetails = {
      id: 1,
      title: "",
      numRecruitment: 0,
      role: "개발",
      requirements: "js",
      priority: "react",
      jobDescriptionId: jobDescriptions_2.id,
    };

    const resume: Resumes = {
      id: 1,
      title: "이력서1",
      content: null,
      isPublic: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId,
    };

    const r1 = {
      ...resumeApplying_1,
      jobDescriptions: { ...jobDescriptions_1, jdDetails: [jdDetails_1] },
      resumes: resume,
    };

    const r2 = {
      ...resumeApplying_2,
      jobDescriptions: { ...jobDescriptions_1, jdDetails: [jdDetails_2] },
      resumes: resume,
    };

    const arr = [r2, r1];

    const mock = prismaMock.resumeApplyings.findMany.mockResolvedValue(arr);

    const spy = jest.spyOn(companyService, "findResumeApplying");

    const founds = await companyService.findResumeApplying(userId);

    if (!founds || !founds.length) {
      throw new Error();
    }

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(userId);

    for (const [index, value] of founds.entries()) {
      expect(value).toEqual(expect.objectContaining(arr[index]));
    }
  });
});
