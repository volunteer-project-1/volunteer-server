/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container } from "typedi";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { ResumeService } from "../..";
import { newResumeInfoFactory } from "../../../factory";
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

describe("deleteResumeInfo Test", () => {
  const resumeService = Container.get(ResumeService);
  it("If success return deleted ResumeInfo", async () => {
    const resumeInfoId = 1;

    const spy = jest.spyOn(resumeService, "deleteResumeInfo");

    const deletedData = newResumeInfoFactory();

    const mock = prismaMock.resumeInfos.delete.mockResolvedValue(
      deletedData as any
    );

    const result = await resumeService.deleteResumeInfo(resumeInfoId);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(resumeInfoId);

    expect(result).toBe(deletedData);
  });
});
