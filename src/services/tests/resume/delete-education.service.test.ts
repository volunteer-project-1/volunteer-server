/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container } from "typedi";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { ResumeService, UserService } from "../..";
import { newEducationFactory } from "../../../factory";
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

describe("deleteEducation Test", () => {
  const resumeService = Container.get(ResumeService);
  it("If success return affectedRows", async () => {
    const educationId = 1;

    const spy = jest.spyOn(resumeService, "deleteEducation");

    const deletedData = newEducationFactory();

    const mock = prismaMock.educations.delete.mockResolvedValue(
      deletedData as any
    );

    const result = await resumeService.deleteEducation(educationId);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(educationId);

    expect(result).toBe(deletedData);
  });
});
