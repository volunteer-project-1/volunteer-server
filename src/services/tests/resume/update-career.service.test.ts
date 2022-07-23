/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container } from "typedi";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { ResumeService, UserService } from "../..";
import { newCareerFactory } from "../../../factory";
import { IUpdateCareer } from "../../../types";
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

describe("updateCareer Test", () => {
  const resumeService = Container.get(ResumeService);
  it("If success return updated career", async () => {
    const userId = 1;
    const spy = jest.spyOn(resumeService, "updateCareer");

    const updatedData: IUpdateCareer = {
      career: { ...newCareerFactory() },
    };

    const mock = prismaMock.careers.update.mockResolvedValue(
      updatedData as any
    );

    const result = await resumeService.updateCareer(userId, updatedData);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(userId, updatedData);
    expect(result).toBe(updatedData);
  });
});
