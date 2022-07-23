/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container } from "typedi";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { ResumeService, UserService } from "../..";
import { newResumeFactory } from "../../../factory";
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

describe("deleteResume Test", () => {
  const resumeService = Container.get(ResumeService);
  it("If success return deleted Resume", async () => {
    const reusmeId = 1;

    const spy = jest.spyOn(resumeService, "deleteResume");

    const deletedData = newResumeFactory();

    const mock = prismaMock.resumes.delete.mockResolvedValue(
      deletedData as any
    );

    const result = await resumeService.deleteResume(reusmeId);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(reusmeId);

    expect(result).toBe(deletedData);
  });
});
