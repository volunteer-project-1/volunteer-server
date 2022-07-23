/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient, Profiles, UserMetas, Users } from "@prisma/client";
import "reflect-metadata";
import { Container } from "typedi";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { UserService } from "../..";
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

describe("findMyProfile Test", () => {
  const userService = Container.get(UserService);
  it("If not found, return null", async () => {
    const id = 1;

    const spy = jest.spyOn(userService, "findMyProfile");
    const mock = prismaMock.users.findUnique.mockResolvedValue(null);

    const result = await userService.findMyProfile(id);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(id);
    expect(result).toBeNull();
  });

  it("'findMyProfile' return 'users', 'profiles', 'userMetas' (ReturnFindMyProfileDTO) ", async () => {
    const email = "ehgks0083@gmail.com";
    const id = 1;

    const spy = jest.spyOn(userService, "findMyProfile");
    const mock = prismaMock.users.findUnique.mockResolvedValue({
      id: 1,
      email,
      userMetas: { isVerified: false, type: "seeker" },
      profiles: {},
    } as Users & {
      userMetas: UserMetas | null;
      profiles: Profiles | null;
    });

    const result = await userService.findMyProfile(id);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(id);
    expect(result).toEqual(
      expect.objectContaining({
        id,
        email,
      })
    );
    expect(result?.userMetas).toEqual(
      expect.objectContaining({ isVerified: false, type: "seeker" })
    );
  });
});
