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

describe("find-company-job-description Test", () => {
  const companyService = Container.get(CompanyService);

  it("jobDescription 조회 실패시 null 반환", async () => {
    const spy = jest.spyOn(companyService, "findJobDescriptionById");
    const IN_VALID_JD_ID = 123;

    const mock = prismaMock.jobDescriptions.findUnique.mockResolvedValue(null);

    const found = await companyService.findJobDescriptionById(IN_VALID_JD_ID);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(IN_VALID_JD_ID);
    expect(found).toBeNull();
  });

  it("If created, return FindJobDescriptionDto", async () => {
    const jdData = newCompanyJobDescriptionFactory();
    const jobDescriptionId = 1;

    const mock = prismaMock.jobDescriptions.findUnique.mockResolvedValue({
      ...jdData,
    } as any);
    const spy = jest.spyOn(companyService, "findJobDescriptionById");

    const found = await companyService.findJobDescriptionById(jobDescriptionId);
    if (!found) {
      throw new Error("Should not reach this");
    }

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(jobDescriptionId);

    expect(found.jdWorkCondition).toEqual(
      expect.objectContaining(jdData.jdWorkCondition)
    );

    expect(found.jdDetails).toEqual(
      expect.arrayContaining(
        jdData.jdDetails.map((detail) => expect.objectContaining(detail))
      )
    );

    expect(found.jdSteps).toEqual(
      expect.arrayContaining(
        jdData.jdSteps.map((step) => expect.objectContaining(step))
      )
    );

    expect(found.jdWelfares).toEqual(
      expect.arrayContaining(
        jdData.jdWelfares.map((welfare) => expect.objectContaining(welfare))
      )
    );
  });
});
