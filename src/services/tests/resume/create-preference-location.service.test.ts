/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container } from "typedi";
import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { ResumeService } from "../..";
import { newPreferenceLocationFactory } from "../../../factory";
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

describe("createPreferenceLocation Test", () => {
  const resumeService = Container.get(ResumeService);

  it("If created, return CreatePreferenceLocationDto", async () => {
    const preferenceId = 1;

    const data = newPreferenceLocationFactory();

    const mock = prismaMock.preferenceLocations.create.mockResolvedValue({
      id: 1,
      preferenceId,
      ...data,
    });

    const spy = jest.spyOn(resumeService, "createPreferenceLocation");

    const result = await resumeService.createPreferenceLocation(
      preferenceId,
      data
    );

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(preferenceId, data);

    expect(result).toEqual(expect.objectContaining(data));
  });
});
