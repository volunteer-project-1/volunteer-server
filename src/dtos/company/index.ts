/* eslint-disable max-classes-per-file */
import { IsDateString, IsDefined, IsNumber, IsString } from "class-validator";

export * from "./create-company-local.dto";
export * from "./create-company-history.dto";
export * from "./find-company-history.dto";
export * from "./find-company.dto";
export * from "./update-company-history.dto";
export * from "./create-company-job-description.dto";
export * from "./find-company-job-description.dto";
export * from "./update-company.dto";

export class JobDetail {
  @IsDefined()
  @IsString()
  title!: string;

  @IsDefined()
  @IsNumber()
  num_recruitment!: number;

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
