import { Type } from "class-transformer";
import { ValidateNested, IsNotEmptyObject } from "class-validator";
import { PreferenceDto } from ".";
import { IUpdatePreference } from "../../types";

export class UpdatePreferenceDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PreferenceDto)
  preference!: Partial<
    Omit<PreferenceDto, "preferenceLocations" | "preferenceJobs">
  >;

  constructor({ preference }: IUpdatePreference) {
    this.preference = preference;
  }
}
