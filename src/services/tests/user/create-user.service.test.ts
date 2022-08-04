/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container } from "typedi";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";
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

describe("createUserBySocial Test", () => {
  const userService = Container.get(UserService);
  it("If success return {user, userMetas, profiles}", async () => {
    const email = "ehgks0083@gmail.com";

    const transactionMock = prismaMock.$transaction.mockResolvedValue({
      user: { email },
    });

    const spy = jest.spyOn(userService, "createUserBySocial");

    const { user } = await userService.createUserBySocial(email);

    expect(transactionMock).toHaveBeenCalled();

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(email);

    expect(user.email).toEqual(email);
  });
  it("If success return {user, userMetas, profiles}", async () => {
    const email = "ehgks0083@gmail.com";
    const spy = jest.spyOn(userService, "createUserBySocial");

    const transactionMock = prismaMock.$transaction.mockResolvedValue({
      user: { email },
      userMetas: {},
      profiles: {},
    });

    const { user, userMetas, profiles } = await userService.createUserBySocial(
      email
    );

    expect(transactionMock).toHaveBeenCalled();

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(email);

    expect(user.email).toEqual(email);

    expect(userMetas).not.toBeNull();
    expect(profiles).not.toBeNull();
  });
});
