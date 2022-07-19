import { Service } from "typedi";
import { Users } from "@prisma/client";
import { IUserDAO, IReturnFindMyProfile, IUpdateProfile } from "../types";
import { Prisma } from "../db";
import { CreateUserByLocalDto } from "../dtos";

@Service()
export class UserDAO implements IUserDAO {
  constructor(private readonly prisma: Prisma) {}

  async findMyProfile(id: number): Promise<IReturnFindMyProfile | null> {
    const user = await this.prisma.client.users.findUnique({
      where: {
        id,
      },
      include: {
        userMetas: true,
        profiles: true,
      },
    });

    return Prisma.convertBigIntToInt(user);
  }

  async updateMyProfile(id: number, profile: IUpdateProfile) {
    const updatedUser = await this.prisma.client.profiles.update({
      where: {
        userId: id,
      },
      data: {
        ...profile,
      },
    });

    return Prisma.convertBigIntToInt(updatedUser);
  }

  async findOneById(id: number): Promise<Users | null> {
    const user = await this.prisma.client.users.findUnique({
      where: { id },
    });
    return Prisma.convertBigIntToInt(user);
  }

  async find({
    start,
    limit,
  }: {
    start: number;
    limit: number;
  }): Promise<Users[]> {
    const users = await this.prisma.client.users.findMany({
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

    return Prisma.convertBigIntToIntArray(users);
  }

  async findByEmail(email: string): Promise<Users | null> {
    const user = await this.prisma.client.users.findUnique({
      where: {
        email,
      },
    });
    return Prisma.convertBigIntToInt(user);
  }

  async createUserBySocial(email: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-return-await
    return await this.prisma.client.$transaction(async (prisma) => {
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
        user: Prisma.convertBigIntToInt(user),
        userMetas: Prisma.convertBigIntToInt(userMetas),
        profiles: Prisma.convertBigIntToInt(profiles),
      };
    });
  }

  async createUserByLocal({
    email,
    password,
    salt,
  }: CreateUserByLocalDto & { salt: string }) {
    // eslint-disable-next-line no-return-await
    return await this.prisma.client.$transaction(async (prisma) => {
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
        user: Prisma.convertBigIntToInt(user),
        userMetas: Prisma.convertBigIntToInt(userMetas),
        profiles: Prisma.convertBigIntToInt(profiles),
      };
    });
  }
}
