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

describe("findUserByEmail Test", () => {
  const userService = Container.get(UserService);
  it("If Not Found return undefined", async () => {
    const email = "ehgks0083@gmail.com";

    const mock = prismaMock.users.findUnique.mockResolvedValue(null);

    const spy = jest.spyOn(userService, "findUserByEmail");

    const result = await userService.findUserByEmail(email);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(email);
    expect(result).toBeNull();
  });

  it("returns IUser", async () => {
    const email = "ehgks00@gmail.com";
    // await userService.createUserBySocial(email);

    const mock = prismaMock.users.findUnique.mockResolvedValue({
      email,
    } as Users);

    const spy = jest.spyOn(userService, "findUserByEmail");

    const result = await userService.findUserByEmail(email);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(email);
    expect(result).toEqual(expect.objectContaining({ email }));
  });
});
