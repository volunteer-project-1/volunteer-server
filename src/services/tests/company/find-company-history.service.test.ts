/* eslint-disable @typescript-eslint/no-unused-vars */
import { CompanyHistories, PrismaClient } from "@prisma/client";
import "reflect-metadata";
import { Container } from "typedi";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { CompanyService } from "../..";
import { CreateCompanyHistoryDto } from "../../../dtos";
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

describe("find-Company-history Test", () => {
  const companyService = Container.get(CompanyService);

  it("If not found, return null", async () => {
    const mock = prismaMock.companyHistories.findUnique.mockResolvedValue(null);

    const spy = jest.spyOn(companyService, "findCompanyHistory");

    const results = await companyService.findCompanyHistory(1);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(1);

    expect(results).toBeNull();
  });

  it("조회 성공 시, return companyHistory", async () => {
    const companyHistoryId = 1;
    const companyHistoryData: CreateCompanyHistoryDto = {
      content: "연혁 1",
      historyAt: new Date(),
    };

    const mock = prismaMock.companyHistories.findUnique.mockResolvedValue(
      companyHistoryData as CompanyHistories
    );

    const spy = jest.spyOn(companyService, "findCompanyHistory");

    const result = await companyService.findCompanyHistory(companyHistoryId);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(companyHistoryId);

    expect(result).not.toBeNull();
  });
});
