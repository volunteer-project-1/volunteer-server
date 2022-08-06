import { Prisma } from "@prisma/client";
import { ICreateEducation } from "../../types";

export class CreateEducationDto implements ICreateEducation {
  type!: string | null;

  schoolName!: string | null;

  graduationYear!: Date | null;

  admissionYear!: Date | null;

  isGraduated!: boolean | null;

  major!: string | null;

  credit!: Prisma.Decimal | null;

  totalCredit!: Prisma.Decimal | null;
}
