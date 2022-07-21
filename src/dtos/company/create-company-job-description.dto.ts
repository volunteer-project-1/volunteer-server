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
  startedAt!: Date;

  @IsDefined()
  @IsDateString()
  deadlineAt!: Date;

  @IsDefined()
  @IsString()
  category!: string;

  @IsDefined()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => JobDetail)
  jdDetails!: JobDetail[];

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => WorkCondition)
  jdWorkCondition!: WorkCondition;

  @IsDefined()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => JdStep)
  jdSteps!: JdStep[];

  @IsDefined()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => Welfare)
  jdWelfares!: Welfare[];

  constructor({
    startedAt,
    deadlineAt,
    category,
    jdDetails,
    jdWorkCondition,
    jdSteps,
    jdWelfares,
  }: {
    startedAt: Date;
    deadlineAt: Date;
    category: string;
    jdDetails: JobDetail[];
    jdWorkCondition: WorkCondition;
    jdSteps: JdStep[];
    jdWelfares: Welfare[];
  }) {
    this.startedAt = startedAt;
    this.deadlineAt = deadlineAt;
    this.category = category;
    this.jdDetails = jdDetails;
    this.jdWorkCondition = jdWorkCondition;
    this.jdSteps = jdSteps;
    this.jdWelfares = jdWelfares;
  }
}
