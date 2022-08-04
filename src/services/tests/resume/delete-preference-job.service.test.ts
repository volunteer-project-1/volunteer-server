/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container } from "typedi";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { ResumeService } from "../..";
import { newPreferenceJobFactory } from "../../../factory";
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

describe("deletePreferenceJob Test", () => {
  const resumeService = Container.get(ResumeService);
  it("If success return deleted Preference Job", async () => {
    const preferenceJobId = 1;

    const spy = jest.spyOn(resumeService, "deletePreferenceJob");

    const deletedData = newPreferenceJobFactory();

    const mock = prismaMock.preferenceJobs.delete.mockResolvedValue(
      deletedData as any
    );

    const result = await resumeService.deletePreferenceJob(preferenceJobId);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(preferenceJobId);

    expect(result).toBe(deletedData);
  });
});
