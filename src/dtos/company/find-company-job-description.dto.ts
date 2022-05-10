import { Expose } from "class-transformer";
import { JdStep, JobDetail, Welfare, WorkCondition } from ".";

export class FindJobDescriptionDto {
  @Expose()
  id!: number;

  @Expose()
  started_at!: string;

  @Expose()
  deadline_at!: string;

  @Expose()
  category!: string;

  @Expose()
  jd_details!: (JobDetail & { id: number })[];

  @Expose()
  jd_work_condition!: WorkCondition & { id: number };

  @Expose()
  jd_steps!: (JdStep & { id: number })[];

  @Expose()
  jd_welfares!: (Welfare & { id: number })[];
}
