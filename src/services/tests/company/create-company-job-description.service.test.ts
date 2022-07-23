/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container } from "typedi";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { CompanyService } from "../..";
import { newCompanyJobDescriptionFactory } from "../../../factory";
import Prisma from "../../../db/prisma";

jest.mock("../../../db/prisma", () => {
  return {
    __esModule: true,
    default: mockDeep<PrismaClient>(),
    // ...orig,
  };
});

beforeEach(() => {
  // eslint-disable-next-line no-use-before-define
  mockReset(prismaMock);
});

const prismaMock = Prisma as unknown as DeepMockProxy<PrismaClient>;

describe("create-company-job-description Test", () => {
  const companyService = Container.get(CompanyService);

  it("If created, return OkPacket", async () => {
    const companyId = 1;

    const jdData = newCompanyJobDescriptionFactory();
    const { jdDetails, jdWelfares, jdWorkCondition, jdSteps, ...rest } = jdData;

    const mock = prismaMock.$transaction.mockResolvedValue({
      jobDescription: { ...rest, companyId },
      jdDetails,
      jdWorkCondition,
      jdSteps,
      jdWelfares,
    });

    const spy = jest.spyOn(companyService, "createJobDescription");

    const { jobDescription } = await companyService.createJobDescription(
      companyId,
      jdData
    );

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(companyId, jdData);

    expect(jobDescription).toEqual(
      expect.objectContaining({
        companyId,
        category: jdData.category,
        deadlineAt: jdData.deadlineAt,
        startedAt: jdData.startedAt,
      })
    );
  });
});
