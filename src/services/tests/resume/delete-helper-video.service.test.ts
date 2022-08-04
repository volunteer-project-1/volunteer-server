/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container } from "typedi";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { ResumeService } from "../..";
import { newHelperVideoFactory } from "../../../factory";
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

describe("deleteHelperVideo Test", () => {
  const resumeService = Container.get(ResumeService);
  it("If success return affectedRows", async () => {
    const helperVideoId = 1;

    const spy = jest.spyOn(resumeService, "deleteHelperVideo");

    const deletedData = newHelperVideoFactory();

    const mock = prismaMock.helperVideos.delete.mockResolvedValue(
      deletedData as any
    );

    const result = await resumeService.deleteHelperVideo(helperVideoId);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(helperVideoId);

    expect(result).toBe(deletedData);
  });
});
