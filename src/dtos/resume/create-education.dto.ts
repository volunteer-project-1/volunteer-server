import { Prisma } from "@prisma/client";
import {
  IsBoolean,
  IsDateString,
  // IsNotEmpty,
  IsNumberString,
  IsString,
} from "class-validator";
import { ICreateEducation } from "../../types";

export class CreateEducationDto implements ICreateEducation {
  // @IsNotEmpty()
  @IsString()
  type!: string | null;

  // @IsNotEmpty()
  @IsString()
  schoolName!: string | null;

  // @IsNotEmpty()
  @IsDateString()
  graduationYear!: Date | null;

  // @IsNotEmpty()
  @IsDateString()
  admissionYear!: Date | null;

  // @IsNotEmpty()
  @IsBoolean()
  isGraduated!: boolean | null;

  // @IsNotEmpty()
  @IsString()
  major!: string | null;

  // @IsNotEmpty()
  @IsNumberString()
  credit!: Prisma.Decimal | null;

  // @IsNotEmpty()
  @IsNumberString()
  totalCredit!: Prisma.Decimal | null;
}
