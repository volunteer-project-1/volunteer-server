import "reflect-metadata";
import { Container } from "typedi";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { CompanyService } from "../..";
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

describe("findCompanyList Test", () => {
  const companyService = Container.get(CompanyService);
  it("If not found, return empty array []", async () => {
    const data = { start: 1, limit: 5 };

    const mock = prismaMock.companys.findMany.mockResolvedValue([]);
    const spy = jest.spyOn(companyService, "findCompanyList");

    const results = await companyService.findCompanyList(data);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(data);

    expect(results).toEqual([]);
  });
});
