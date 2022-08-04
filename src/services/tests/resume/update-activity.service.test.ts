/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container } from "typedi";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { ResumeService, UserService } from "../..";
import { newActivityFactory } from "../../../factory";
import { IUpdateActivity } from "../../../types";
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
describe("updateActivity Test", () => {
  const resumeService = Container.get(ResumeService);
  it("If success return updated Activity", async () => {
    const userId = 1;

    const spy = jest.spyOn(resumeService, "updateActivity");

    const updatedData: IUpdateActivity = {
      activity: { ...newActivityFactory() },
    };

    const mock = prismaMock.activities.update.mockResolvedValue(
      updatedData as any
    );

    const result = await resumeService.updateActivity(userId, updatedData);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(userId, updatedData);
    expect(result).toBe(updatedData);
  });
});
