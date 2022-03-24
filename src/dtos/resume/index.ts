/* eslint-disable max-classes-per-file */
import {
  ValidateNested,
  IsDefined,
  ArrayMinSize,
  IsNumber,
  IsString,
  IsBoolean,
  IsUrl,
} from "class-validator";
import { Type } from "class-transformer";
import { DisabilityLevel, DisabilityType, Sex } from "../../types";

// export * from "./create.dto";

export * from "./create-resume.dto";
export * from "./update-resume.dto";
export * from "./update-resume-info.dto";
export * from "./update-education.dto";
export * from "./update-career.dto";
export * from "./update-activity.dto";
export * from "./update-award.dto";
export * from "./update-my-video.dto";
export * from "./update-helper-video.dto";
export * from "./update-preference.dto";
export * from "./update-preference-job.dto";
export * from "./update-preference-location.dto";

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
  disability_level!: DisabilityLevel;

  @IsString()
  disability_type!: DisabilityType;

  @IsString()
  sex!: Sex;
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

  @IsDefined()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => PreferenceLocationDto)
  preferenceLocations!: PreferenceLocationDto[];

  @IsDefined()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => PreferenceJobDto)
  preferenceJobs!: PreferenceJobDto[];
}
