/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container } from "typedi";
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { ResumeService } from "../..";
import { newEducationFactory, newResumeAllFactory } from "../../../factory";
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

describe("createEducation Test", () => {
  const resumeService = Container.get(ResumeService);

  it("If created, return CreateEducationDto", async () => {
    const resumeId = 1;

    const data = newEducationFactory();

    const mock = prismaMock.educations.create.mockResolvedValue({
      id: 1,
      resumeId: 1,
      ...data,
    });

    const spy = jest.spyOn(resumeService, "createEducation");

    const result = await resumeService.createEducation(resumeId, data);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(resumeId, data);

    expect(result).toEqual(expect.objectContaining(data));
  });
});
