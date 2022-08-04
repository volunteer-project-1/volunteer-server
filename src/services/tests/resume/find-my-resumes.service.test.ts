/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container } from "typedi";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { PrismaClient, Resumes } from "@prisma/client";
import { ResumeService, UserService } from "../..";
import { newResumeFactory } from "../../../factory";
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

describe("findMyResumes Test", () => {
  const userService = Container.get(UserService);
  const resumeService = Container.get(ResumeService);
  it("return undefined", async () => {
    // const { user } = await userService.createUserBySocial(
    //   "ehgks0083@gmail.com"
    // );
    const userId = 1;
    // const data = newResumeFactory();
    const mockResult: Resumes[] = [
      {
        id: 1,
        title: "asdf",
        content: "내용",
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: true,
        userId,
      },
    ];
    const mock = prismaMock.resumes.findMany.mockResolvedValue(mockResult);
    // await resumeService.createResume(userId, data);

    const spy = jest.spyOn(resumeService, "findMyResumes");

    const results = await resumeService.findMyResumes(userId);

    expect(mock).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(userId);

    expect(results!.length).toBeLessThan(11);

    // expect(results.title).toBe(data.resume.title);
    // expect(results.content).toBe(data.resume.content);

    // expect(results.activities).toEqual(
    //   expect.arrayContaining(
    //     data.activities.map((activity) => expect.objectContaining(activity))
    //   )
    // );
  });
});
