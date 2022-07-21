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
} from "class-validator";
import { Type } from "class-transformer";
import { DisabilityLevel, DisabilityType, Sex } from "../../types";

export class ResumeDto {
  @IsString()
  title!: string;

  @IsString()
  content!: string;

  @IsBoolean({ always: false })
  is_public!: boolean;
}

export class ResumeInfoDto {
  @IsString()
  name!: string;

  @IsString()
  birthday!: string;

  @IsString()
  phone_number!: string;

  @IsString()
  email!: string;

  @IsString()
  sido!: string;

  @IsString()
  sigungu!: string;

  @IsNumber()
  disability_level?: DisabilityLevel;

  @IsString()
  disability_type?: DisabilityType;

  @IsString()
  sex!: Sex;

  @IsString()
  @IsUrl()
  avatar?: string;
}

export class EducationDto {
  @IsString()
  type!: string;

  @IsString()
  school_name!: string;

  @IsString()
  graduation_year!: string;

  @IsString()
  admission_year!: string;

  @IsBoolean()
  is_graduated!: boolean;

  @IsString()
  major!: string;

  @IsNumber()
  credit!: number;

  @IsNumber()
  total_credit!: number;
}

export class CareerDto {
  @IsString()
  company!: string;

  @IsString()
  department!: string;

  @IsString()
  position!: string;

  @IsString()
  task!: string;

  @IsString()
  joined_at!: string;
}

export class ActivityDto {
  @IsString()
  organization!: string;

  @IsString()
  description!: string;
}

export class TrainingDto {
  @IsString()
  name!: string;

  @IsString()
  institute!: string;

  @IsString()
  content!: string;

  @IsString()
  //   @IsDateString()
  started_at!: string;

  @IsString()
  //   @IsDateString()
  finished_at!: string;
}
export class CertificateDto {
  @IsString()
  name!: string;

  @IsString()
  institute!: string;

  @IsString()
  acquisition_at!: string;
}

export class AwardDto {
  @IsString()
  institute!: string;

  @IsString()
  //   @IsDateString()
  started_at!: string;

  @IsString()
  //   @IsDateString()
  finished_at!: string;
}

export class PortfolioDto {
  @IsString()
  @IsUrl()
  url!: string;
}
export class IntroductionDto {
  @IsString()
  @MaxLength(20)
  title!: string;

  @IsString()
  @MaxLength(800)
  content!: string;
}
export class MyVideoDto {
  @IsString()
  @IsUrl()
  url!: string;
}

export class HelperVideoDto {
  @IsString()
  @IsUrl()
  url!: string;
}

export class PreferenceLocationDto {
  @IsString()
  sido!: string;

  @IsString()
  sigungu!: string;
}

export class PreferenceJobDto {
  @IsString()
  name!: string;
}

export class PreferenceDto {
  @IsNumber()
  employ_type!: number;

  @IsNumber()
  salary!: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => PreferenceLocationDto)
  preferenceLocations?: PreferenceLocationDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => PreferenceJobDto)
  preferenceJobs?: PreferenceJobDto[];
}
