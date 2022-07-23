/* eslint-disable no-return-await */
import { Service } from "typedi";
import { Users } from "@prisma/client";
import { IUserDAO, IUpdateProfile } from "../types";
import Prisma from "../db/prisma";
import { CreateUserByLocalDto } from "../dtos";

@Service()
export class UserDAO implements IUserDAO {
  private readonly prisma;

  constructor() {
    this.prisma = Prisma;
  }

  async findMyProfile(id: number) {
    return await this.prisma.users.findUnique({
      where: {
        id,
      },
      include: {
        userMetas: true,
        profiles: true,
      },
    });
  }

  async updateMyProfile(id: number, profile: IUpdateProfile) {
    return await this.prisma.profiles.update({
      where: {
        id,
      },
      data: {
        ...profile,
      },
    });
  }

  async findOneById(id: number): Promise<Users | null> {
    return await this.prisma.users.findUnique({
      where: { id },
    });
  }

  async find({
    start,
    limit,
  }: {
    start: number;
    limit: number;
  }): Promise<Users[]> {
    return await this.prisma.users.findMany({
      where: {
        id: {
          gte: start,
        },
      },
      orderBy: {
        id: "asc",
      },
      take: limit,
    });
  }

  async findByEmail(email: string): Promise<Users | null> {
    return await this.prisma.users.findUnique({
      where: {
        email,
      },
    });
  }

  async createUserBySocial(email: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-return-await
    return await this.prisma.$transaction(async (prisma) => {
      const user = await prisma.users.create({
        data: {
          email,
        },
      });

      const userMetas = await prisma.userMetas.create({
        data: {
          userId: user.id,
        },
      });

      const profiles = await prisma.profiles.create({
        data: {
          userId: user.id,
        },
      });

      return {
        user,
        userMetas,
        profiles,
      };
    });
  }

  async createUserByLocal({
    email,
    password,
    salt,
  }: CreateUserByLocalDto & { salt: string }) {
    // eslint-disable-next-line no-return-await
    return await this.prisma.$transaction(async (prisma) => {
      const user = await prisma.users.create({
        data: {
          email,
          password,
          salt,
        },
      });

      const userMetas = await prisma.userMetas.create({
        data: {
          userId: user.id,
        },
      });

      const profiles = await prisma.profiles.create({
        data: {
          userId: user.id,
        },
      });

      return {
        user,
        userMetas,
        profiles,
      };
    });
  }
}
