/* eslint-disable @typescript-eslint/no-unused-vars */
import { Companys, PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import "reflect-metadata";
import { Container } from "typedi";
import { CompanyService } from "../..";
import Prisma from "../../../db/prisma";
import { UpdateCompanyDto } from "../../../dtos";

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

describe("update-company Test", () => {
  const companyService = Container.get(CompanyService);
  //   it("If duplicated created, return company", async () => {
  //     const data: ICreateCompany = {
  //       email: "company@gmail.com",
  //       password: "company",
  //       name: "회사명",
  //     };

  //     const spy = jest.spyOn(companyService, "createCompany");

  //     await companyService.createCompany(data);
  //     try {
  //       await companyService.createCompany(data);
  //       throw new BadReqError("You Should not reach this");
  //     } catch (e) {
  //       expect(spy).toBeCalled();
  //       expect(spy).toBeCalledWith(data);

  //       //   expect(e.message).toEqual(expect.stringContaining("Duplicate"));
  //       expect(e).not.toBeInstanceOf(BadReqError);
  //     }
  //   });

  it("If created, return company", async () => {
    const updateData: UpdateCompanyDto = {
      name: "회사명2",
      introduce: "회사 소개~",
    };

    const updatedData: Companys = {
      id: 1,
      salt: "Asdfasdf",
      email: "company@gmail.com",
      password: "company",
      name: "회사명",
      introduce: null,
      foundedAt: null,
      member: 10,
      accInvestment: 10,
      homepage: null,
      phoneNumber: null,
      address: null,
      industryType: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      ...updateData,
    };

    const mock = prismaMock.companys.update.mockResolvedValue(updatedData);

    const spy = jest.spyOn(companyService, "updateCompany");

    const updatedCompany = await companyService.updateCompany(
      updatedData.id,
      updateData
    );

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(updatedData.id, updateData);

    expect(updatedCompany).toEqual(expect.objectContaining(updateData));
  });
});
