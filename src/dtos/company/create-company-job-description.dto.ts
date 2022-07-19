/* eslint-disable camelcase */
import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsDateString,
  IsDefined,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
} from "class-validator";
import { JdStep, JobDetail, Welfare, WorkCondition } from ".";

export class CreateJobDescriptionDto {
  @IsDefined()
  @IsDateString()
  started_at!: string;

  @IsDefined()
  @IsDateString()
  deadline_at!: string;

  @IsDefined()
  @IsString()
  category!: string;

  @IsDefined()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => JobDetail)
  jd_details!: JobDetail[];
  //   jd_details!: JobDetail[];

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => WorkCondition)
  jd_work_condition!: WorkCondition;

  @IsDefined()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => JdStep)
  jd_steps!: JdStep[];

  @IsDefined()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => Welfare)
  jd_welfares!: Welfare[];

  constructor({
    started_at,
    deadline_at,
    category,
    jd_details,
    jd_work_condition,
    jd_steps,
    jd_welfares,
  }: {
    started_at: string;
    deadline_at: string;
    category: string;
    jd_details: JobDetail[];
    jd_work_condition: WorkCondition;
    jd_steps: JdStep[];
    jd_welfares: Welfare[];
  }) {
    this.started_at = started_at;
    this.deadline_at = deadline_at;
    this.category = category;
    this.jd_details = jd_details;
    this.jd_work_condition = jd_work_condition;
    this.jd_steps = jd_steps;
    this.jd_welfares = jd_welfares;
  }
}
