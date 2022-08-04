/* eslint-disable max-classes-per-file */
import {
  ValidateNested,
  ArrayMinSize,
  IsNumber,
  IsString,
  IsBoolean,
  IsUrl,
  MaxLength,
  IsOptional,
  IsDateString,
} from "class-validator";
import { Type } from "class-transformer";
import { Prisma } from "@prisma/client";
// import { DisabilityLevel, DisabilityType, Sex } from "../../types";

export class ResumeDto {
  @IsString()
  title!: string;

  @IsString()
  content!: string | null;

  @IsBoolean({ always: false })
  isPublic!: boolean | null;
}

export class ResumeInfoDto {
  @IsString()
  name!: string | null;

  @IsDateString()
  birthday!: Date;

  @IsString()
  phoneNumber!: string | null;

  @IsString()
  email!: string | null;

  @IsString()
  sido!: string | null;

  @IsString()
  sigungu!: string | null;

  @IsNumber()
  disabilityLevel!: number | null;

  @IsString()
  disabilityType!: string | null;

  @IsString()
  sex!: string | null;

  @IsString()
  @IsUrl()
  avatar!: string | null;
}

export class EducationDto {
  @IsString()
  type!: string | null;

  @IsString()
  schoolName!: string | null;

  @IsDateString()
  graduationYear!: Date | null;

  @IsDateString()
  admissionYear!: Date | null;

  @IsBoolean()
  isGraduated!: boolean | null;

  @IsString()
  major!: string | null;

  @IsNumber()
  credit!: Prisma.Decimal | null;

  @IsNumber()
  totalCredit!: Prisma.Decimal | null;
}

export class CareerDto {
  @IsString()
  company!: string | null;

  @IsString()
  department!: string | null;

  @IsString()
  position!: string | null;

  @IsString()
  task!: string | null;

  @IsDateString()
  joinedAt!: Date | null;

  @IsDateString()
  quitedAt!: Date | null;

  @IsBoolean()
  isInOffice!: boolean | null;
}

export class ActivityDto {
  @IsString()
  organization!: string | null;

  @IsString()
  description!: string | null;
}

export class TrainingDto {
  @IsString()
  name!: string | null;

  @IsString()
  institute!: string | null;

  @IsString()
  content!: string | null;

  // @IsString()
  @IsDateString()
  startedAt!: Date | null;

  // @IsString()
  @IsDateString()
  finishedAt!: Date | null;
}
export class CertificateDto {
  @IsString()
  name!: string | null;

  @IsString()
  institute!: string | null;

  @IsDateString()
  acquisitionAt!: Date | null;
}

export class AwardDto {
  @IsString()
  name!: string | null;

  @IsString()
  institute!: string | null;

  @IsDateString()
  startedAt!: Date | null;

  @IsDateString()
  finishedAt!: Date | null;
}

export class PortfolioDto {
  @IsString()
  @IsUrl()
  url!: string | null;
}
export class IntroductionDto {
  @IsString()
  @MaxLength(20)
  title!: string | null;

  @IsString()
  @MaxLength(800)
  content!: string | null;
}
export class MyVideoDto {
  @IsString()
  @IsUrl()
  url!: string | null;
}

export class HelperVideoDto {
  @IsString()
  @IsUrl()
  url!: string | null;
}

export class PreferenceLocationDto {
  @IsString()
  sido!: string | null;

  @IsString()
  sigungu!: string | null;
}

export class PreferenceJobDto {
  @IsString()
  name!: string | null;
}

export class PreferenceDto {
  @IsString()
  employType!: string | null;

  @IsNumber()
  salary!: number | null;

  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => PreferenceLocationDto)
  preferenceLocations!: PreferenceLocationDto[] | null;

  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => PreferenceJobDto)
  preferenceJobs!: PreferenceJobDto[] | null;
}
