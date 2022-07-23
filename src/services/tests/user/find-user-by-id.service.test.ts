/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient, Users } from "@prisma/client";
import "reflect-metadata";
import { Container } from "typedi";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { UserService } from "../..";
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

describe("findUserById Test", () => {
  const userService = Container.get(UserService);
  it("If Not Found return undefined", async () => {
    const id = 1;

    const mock = prismaMock.users.findUnique.mockResolvedValue(null);

    const spy = jest.spyOn(userService, "findUserById");

    const result = await userService.findUserById(id);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(id);
    expect(result).toBeNull();
  });

  it("If success return IUser", async () => {
    const email = "ehgks0083@gmail.com";
    const id = 1;

    const mock = prismaMock.users.findUnique.mockResolvedValue({
      id,
      email,
    } as Users);

    const spy = jest.spyOn(userService, "findUserById");

    const result = await userService.findUserById(id);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(id);
    expect(result).toEqual(expect.objectContaining({ id, email }));
  });
});
