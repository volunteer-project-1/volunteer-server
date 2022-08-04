/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container } from "typedi";
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { ResumeService } from "../..";
import { newResumeAllFactory } from "../../../factory";
import { CreateResumeDto } from "../../../dtos";
import Prisma from "../../../db/prisma";

jest.mock("../../../db/prisma", () => {
  return {
    __esModule: true,
    default: mockDeep<PrismaClient>(),
  };
});

beforeEach(() => {
  // eslint-disable-next-line no-use-before-define
  mockReset(prismaMock);
});

const prismaMock = Prisma as unknown as DeepMockProxy<PrismaClient>;

describe("createResume Test", () => {
  const resumeService = Container.get(ResumeService);

  it("If success (필수항목) return CreateResumeDto", async () => {
    const userId = 1;
    const mockResult = { resume: { id: 1 }, resumeInfo: {}, myVideo: {} };

    const data: CreateResumeDto = {
      resume: { title: "레쥬메1", content: "블라블라 내용", isPublic: true },
      resumeInfo: {
        name: "홍길동",
        birthday: new Date(),
        phoneNumber: "010-1234-5678",
        email: "test@gmail.com",
        sido: "서울시",
        sigungu: "강서구",
        sex: "남",
        disabilityLevel: 1,
        disabilityType: "sdf",
        avatar: "avatar",
      },
      myVideo: { url: "url.link.com" },
      educations: null,
      careers: null,
      activities: null,
      trainings: null,
      certificates: null,
      awards: null,
      portfolio: null,
      introductions: null,
      helperVideo: null,
      preference: null,
    };

    const mock = prismaMock.$transaction.mockResolvedValue(mockResult);

    const spy = jest.spyOn(resumeService, "createResume");

    const { resume } = await resumeService.createResume(userId, data);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(userId, data);

    expect(resume.id).toBe(1);
  });

  it("If success (전체항목) return CreateResumeDto", async () => {
    const userId = 1;

    const data = newResumeAllFactory();
    const mockResult = {
      ...data,
      resume: { id: 1, ...data.resume },
      // resumeInfo: {},
      // myVideo: {},
    };
    const mock = prismaMock.$transaction.mockResolvedValue(mockResult);

    const spy = jest.spyOn(resumeService, "createResume");

    const result = await resumeService.createResume(userId, data);

    const { preferenceJobs, preferenceLocations, ...rest } = result.preference;

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(userId, data);

    expect(result.resume.id).toBe(1);
    expect(result.resumeInfo).toBe(mockResult.resumeInfo);
    expect(result.myVideo).toBe(mockResult.myVideo);
    expect(result.educations).toBe(mockResult.educations);
    expect(result.careers).toBe(mockResult.careers);
    expect(result.activities).toBe(mockResult.activities);
    expect(result.trainings).toBe(mockResult.trainings);

    expect(result.certificates).toBe(mockResult.certificates);
    expect(result.awards).toBe(mockResult.awards);
    expect(result.portfolio).toBe(mockResult.portfolio);

    expect(result.introductions).toBe(mockResult.introductions);
    expect(result.helperVideo).toBe(mockResult.helperVideo);

    expect(result.preference).toBe(mockResult.preference);
    // expect(result.helperVideo).toBe(mockResult.helperVideo);
    // expect(result.helperVideo).toBe(mockResult.helperVideo);
  });
});
