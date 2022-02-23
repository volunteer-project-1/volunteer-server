import { Type } from "class-transformer";
import { ValidateNested, IsNotEmptyObject } from "class-validator";
import { PreferenceJobDto } from ".";
import { IUpdatePreferenceJob } from "../../types";

export class UpdatePreferenceJobDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PreferenceJobDto)
  preferenceJob!: Partial<PreferenceJobDto>;

  constructor({ preferenceJob }: IUpdatePreferenceJob) {
    this.preferenceJob = preferenceJob;
  }
}
