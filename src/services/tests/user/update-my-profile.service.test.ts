/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient, Profiles } from "@prisma/client";
import "reflect-metadata";
import { Container } from "typedi";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { UserService } from "../..";
import { IUpdateProfile } from "../../../types";
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

describe("updateMyProfile Test", () => {
  const userService = Container.get(UserService);
  it("If success return Profile", async () => {
    const id = 1;
    const data: IUpdateProfile = {
      name: "Lee",
      address: "강서구",
      birthday: new Date(),
    };
    const mock = prismaMock.profiles.update.mockResolvedValue(data as Profiles);

    const spy = jest.spyOn(userService, "updateMyProfile");

    const result = await userService.updateMyProfile(id, data);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(id, data);
    expect(result).toEqual(
      expect.objectContaining({
        ...data,
      })
    );
  });
});
