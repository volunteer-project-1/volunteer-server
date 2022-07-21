import { Expose } from "class-transformer";
import { JdStep, JobDetail, Welfare, WorkCondition } from ".";

export class FindJobDescriptionDto {
  @Expose()
  id!: number;

  @Expose()
  startedAt!: string;

  @Expose()
  deadlineAt!: string;

  @Expose()
  category!: string;

  @Expose()
  jdDetails!: (JobDetail & { id: number })[];

  @Expose()
  jdWorkCondition!: WorkCondition & { id: number };

  @Expose()
  jdSteps!: (JdStep & { id: number })[];

  @Expose()
  jdWelfares!: (Welfare & { id: number })[];
}
