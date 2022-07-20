import { Service } from "typedi";
import { PrismaClient } from "@prisma/client";

@Service()
export class Prisma {
  private prisma;

  constructor() {
    this.prisma = new PrismaClient({
      log: [
        {
          emit: "event",
          level: "query",
        },
        {
          emit: "stdout",
          level: "error",
        },
        {
          emit: "stdout",
          level: "info",
        },
        {
          emit: "stdout",
          level: "warn",
        },
      ],
    });

    this.prisma.$on("query", (e: any) => {
      console.log(`Query: ${e.query}
      Params: ${e.params}
      Duration: ${e.duration}ms
      `);
      // console.log(`Params: ${e.params}`);
      // console.log(`Duration: ${e.duration}ms`);
    });
  }

  get client(): PrismaClient<
    {
      log: (
        | {
            emit: "event";
            level: "query";
          }
        | {
            emit: "stdout";
            level: "error";
          }
        | {
            emit: "stdout";
            level: "info";
          }
        | {
            emit: "stdout";
            level: "warn";
          }
      )[];
    },
    "query",
    false
  > {
    // this.prisma.$queryRawUnsafe
    return this.prisma;
  }

  static convertBigIntToInt<T>(data: T): T {
    return JSON.parse(
      // eslint-disable-next-line no-return-assign
      JSON.stringify(data, (_, value) =>
        // eslint-disable-next-line no-param-reassign
        typeof value === "bigint" ? (value = Number(value.toString())) : value
      )
    );
  }

  static convertBigIntToIntArray<T>(datas: T[]): T[] {
    return datas.map((data) => {
      return Prisma.convertBigIntToInt(data);
    });
  }
}
