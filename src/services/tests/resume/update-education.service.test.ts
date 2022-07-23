/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container } from "typedi";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { ResumeService, UserService } from "../..";
import { newEducationFactory } from "../../../factory";
import { IUpdateEducation } from "../../../types";
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

describe("updateEducation Test", () => {
  const userService = Container.get(UserService);
  const resumeService = Container.get(ResumeService);
  it("If success return changedRows", async () => {
    const userId = 1;

    const updatedData: IUpdateEducation = {
      education: { ...newEducationFactory() },
    };

    const mock = prismaMock.educations.update.mockResolvedValue(
      updatedData as any
    );
    const spy = jest.spyOn(resumeService, "updateEducation");

    const result = await resumeService.updateEducation(userId, updatedData);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(userId, updatedData);
    expect(result).toBe(updatedData);
  });
});
