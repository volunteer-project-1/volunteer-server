/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container } from "typedi";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { ResumeService, UserService } from "../..";
import { newPreferenceFactory } from "../../../factory";
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

describe("deletePreference Test", () => {
  const resumeService = Container.get(ResumeService);
  it("If success return deleted Preference", async () => {
    const preferenceId = 1;

    const spy = jest.spyOn(resumeService, "deletePreference");

    const deletedData = newPreferenceFactory();

    const mock = prismaMock.preferences.delete.mockResolvedValue(
      deletedData as any
    );

    const result = await resumeService.deletePreference(preferenceId);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(preferenceId);

    expect(result).toBe(deletedData);
  });
});
