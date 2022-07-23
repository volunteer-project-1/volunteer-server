/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container } from "typedi";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { ResumeService, UserService } from "../..";
import { newPreferenceJobFactory } from "../../../factory";
import { IUpdatePreferenceJob } from "../../../types";
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

describe("updatePreferenceJob Test", () => {
  const resumeService = Container.get(ResumeService);
  it("If success return updated PreferenceJob", async () => {
    const userId = 1;

    const spy = jest.spyOn(resumeService, "updatePreferenceJob");

    const updatedData: IUpdatePreferenceJob = {
      preferenceJob: { ...newPreferenceJobFactory() },
    };

    const mock = prismaMock.preferenceJobs.update.mockResolvedValue(
      updatedData as any
    );

    const result = await resumeService.updatePreferenceJob(userId, updatedData);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(userId, updatedData);
    expect(result).toBe(updatedData);
  });
});
