import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient();
// const Prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });

export default Prisma;
