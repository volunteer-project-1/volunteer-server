/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Companys, PrismaClient } from "@prisma/client";
import { Container } from "typedi";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { CompanyService } from "../..";
import { BadReqError } from "../../../lib";
import { ICreateCompany } from "../../../types";
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

describe("create-company Test", () => {
  const companyService = Container.get(CompanyService);
  it("If duplicated created, return error", async () => {
    const data = {
      email: "company@gmail.com",
      password: "company",
      name: "회사명",
    };

    const spy = jest.spyOn(companyService, "createCompany");

    const mock = prismaMock.companys.create
      .mockResolvedValueOnce({
        ...data,
        salt: "asdfas",
      } as Companys)
      .mockRejectedValue(new Error("Duplicate"));

    await companyService.createCompany(data);

    try {
      await companyService.createCompany(data);
      throw new BadReqError("You Should not reach this");
    } catch (e) {
      expect(mock).toHaveBeenCalled();
      expect(spy).toBeCalled();
      expect(spy).toBeCalledWith(data);

      //   expect(e.message).toEqual(expect.stringContaining("Duplicate"));
      expect(e).not.toBeInstanceOf(BadReqError);
    }
  });

  it("If created, return company", async () => {
    const data: ICreateCompany = {
      email: "company@gmail.com",
      password: "company",
      name: "회사명",
    };

    const mock = prismaMock.companys.create.mockResolvedValue(data as any);

    const spy = jest.spyOn(companyService, "createCompany");

    const company = await companyService.createCompany(data);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(data);

    const { password, ...rest } = data;
    expect(company).toEqual(expect.objectContaining(rest));
  });
});
