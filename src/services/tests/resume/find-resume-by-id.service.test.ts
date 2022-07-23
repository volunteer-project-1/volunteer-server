/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container } from "typedi";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { ResumeService, UserService } from "../..";
import { newResumeAllFactory, newResumeFactory } from "../../../factory";
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

// TODO 왜안돼?
describe("findResumeById Test", () => {
  const resumeService = Container.get(ResumeService);
  it("필수항목, return Resume", async () => {
    const resumeId = 1;
    const data: CreateResumeDto = newResumeAllFactory();

    const mock = prismaMock.resumes.findUnique.mockResolvedValue(data as any);
    const spy = jest.spyOn(resumeService, "findResumeById");

    const result = await resumeService.findResumeById(resumeId);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(resumeId);

    expect(result!).toBe(data);
  });
});
