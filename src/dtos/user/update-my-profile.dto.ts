import { IsNotEmptyObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { IUpdateProfile } from "../../types";
import { ProfileDto } from ".";

export class UpdateProfileDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ProfileDto)
  profile!: Partial<ProfileDto>;

  constructor({ profile }: IUpdateProfile) {
    this.profile = profile;
  }
}
