/* eslint-disable max-classes-per-file */
import { IsDateString, IsDefined, IsNumber, IsString } from "class-validator";

export class JobDetail {
  @IsDefined()
  @IsString()
  title!: string;

  @IsDefined()
  @IsNumber()
  numRecruitment!: number;

  @IsDefined()
  @IsString()
  role!: string;

  @IsDefined()
  @IsString()
  requirements!: string;

  @IsDefined()
  @IsString()
  priority!: string;
}

export class WorkCondition {
  @IsDefined()
  @IsString()
  type!: string;

  @IsDefined()
  @IsDateString()
  time!: string;

  @IsDefined()
  @IsString()
  place!: string;
}

export class JdStep {
  @IsDefined()
  @IsNumber()
  step!: number;

  @IsDefined()
  @IsString()
  title!: string;
}
export class Welfare {
  @IsDefined()
  @IsString()
  title!: string;

  @IsDefined()
  @IsString()
  content!: string;
}
