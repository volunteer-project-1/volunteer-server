import { Type } from "class-transformer";
import { ValidateNested, IsNotEmptyObject } from "class-validator";
import { PreferenceLocationDto } from ".";
import { IUpdatePreferenceLocation } from "../../types";

export class UpdatePreferenceLocationDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PreferenceLocationDto)
  preferenceLocation!: Partial<PreferenceLocationDto>;

  constructor({ preferenceLocation }: IUpdatePreferenceLocation) {
    this.preferenceLocation = preferenceLocation;
  }
}
