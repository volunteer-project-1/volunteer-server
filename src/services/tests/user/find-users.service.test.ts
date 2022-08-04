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

describe("findUsers Test", () => {
  const userService = Container.get(UserService);

  it("If Not Found return empty array", async () => {
    const spy = jest.spyOn(userService, "findUsers");
    const query = { id: 0, limit: 5 };

    const mock = prismaMock.users.findMany.mockResolvedValue([]);

    const results = await userService.findUsers(query);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(query);
    expect(results).toEqual([]);
  });

  it("If Not Found return users array", async () => {
    const email1 = "ehgks00@gmail.com";
    const email2 = "ehgks0083@gmail.com";

    const mock = prismaMock.users.findMany.mockResolvedValue([
      { email: email2 },
      { email: email1 },
    ] as Users[]);

    const spy = jest.spyOn(userService, "findUsers");

    const query = { id: 0, limit: 5 };

    const results = await userService.findUsers(query);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(query);
    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ email: email2 }),
        expect.objectContaining({ email: email1 }),
      ])
    );
  });
});
