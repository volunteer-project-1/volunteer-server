/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container } from "typedi";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { ResumeService } from "../..";
import { newResumeAllFactory } from "../../../factory";
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

describe("findPublicResumes Test", () => {
  const resumeService = Container.get(ResumeService);

  it("if there are no public resumes, return empty array", async () => {
    const spy = jest.spyOn(resumeService, "findPublicResumes");
    const pageNation = {
      start: 1,
      limit: 5,
    };
    const mock = prismaMock.resumes.findMany.mockResolvedValue([]);
    const results = await resumeService.findPublicResumes(pageNation);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(pageNation);

    expect(results).toEqual([]);
  });

  it("if there are public resumes, return resumes", async () => {
    const mockResult = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
    const mock = prismaMock.resumes.findMany.mockResolvedValue(
      mockResult as any
    );

    const spy = jest.spyOn(resumeService, "findPublicResumes");
    const pageNation = {
      start: 1,
      limit: 5,
    };
    const results = await resumeService.findPublicResumes(pageNation);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(pageNation);

    expect(results!).toBe(mockResult);
    expect(results!.length).toBeLessThan(pageNation.limit + 1);
  });

  it("if there are public resumes, return resumes up to 5", async () => {
    const userId = 1;
    const pageNation = {
      start: 1,
      limit: 5,
    };
    const addOneToLimitArr = Array.from(
      new Array(pageNation.limit),
      (_, i) => i + 1
    );

    const mockResult = addOneToLimitArr.map((i) =>
      newResumeAllFactory({
        resume: { title: `${i}`, content: "내용", isPublic: true },
      })
    );

    const mock = prismaMock.resumes.findMany.mockResolvedValue(
      mockResult as any
    );

    const spy = jest.spyOn(resumeService, "findPublicResumes");

    const results = await resumeService.findPublicResumes(pageNation);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(pageNation);

    expect(results!.length).toBeLessThan(pageNation.limit + 1);
  });
});
