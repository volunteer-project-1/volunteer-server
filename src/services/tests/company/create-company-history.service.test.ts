/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { CompanyHistories, PrismaClient } from "@prisma/client";
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

describe("create-company-history Test", () => {
  const companyService = Container.get(CompanyService);
  it("If created, return companyHistory", async () => {
    const companyId = 1;
    const companyHistoryData: CreateCompanyHistoryDto = {
      content: "블라블라 VC 투자",
      historyAt: new Date(),
    };

    const mock = prismaMock.companyHistories.create.mockResolvedValue(
      companyHistoryData as CompanyHistories
    );

    const spy = jest.spyOn(companyService, "createCompanyHistory");

    const companyHistory = await companyService.createCompanyHistory(
      companyId,
      companyHistoryData
    );

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(companyId, companyHistoryData);

    expect(companyHistory).toEqual(expect.objectContaining(companyHistoryData));
  });
});
