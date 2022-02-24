import { Type } from "class-transformer";
import { ValidateNested, IsNotEmptyObject } from "class-validator";
import { ActivityDto } from ".";
import { IUpdateActivity } from "../../types";

export class UpdateActivityDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ActivityDto)
  activity!: Partial<ActivityDto>;

  constructor({ activity }: IUpdateActivity) {
    this.activity = activity;
  }
}
