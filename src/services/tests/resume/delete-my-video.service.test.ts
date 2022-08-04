/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container } from "typedi";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { ResumeService } from "../..";
import { newMyVideoFactory } from "../../../factory";
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

describe("deleteMyVideo Test", () => {
  const resumeService = Container.get(ResumeService);
  it("If success return deleted MyVideo", async () => {
    const myVideoId = 1;

    const spy = jest.spyOn(resumeService, "deleteMyVideo");

    const deletedData = newMyVideoFactory();

    const mock = prismaMock.myVideos.delete.mockResolvedValue(
      deletedData as any
    );

    const result = await resumeService.deleteMyVideo(myVideoId);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(myVideoId);

    expect(result).toBe(deletedData);
  });
});
