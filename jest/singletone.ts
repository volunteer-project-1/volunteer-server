import { mockReset, mockDeep, DeepMockProxy } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";
import Prisma from "../src/db/prisma";

jest.mock("../src/db/prisma", () => {
  return {
    __esModule: true,
    default: mockDeep<PrismaClient>(),
  };
});

beforeEach(() => {
  // eslint-disable-next-line no-use-before-define
  mockReset(prismaMock);
});

export const prismaMock = Prisma as unknown as DeepMockProxy<PrismaClient>;
