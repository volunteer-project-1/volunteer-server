import { IsDateString, IsOptional, IsString } from "class-validator";
import { IUpdateProfile } from "../../types";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDateString()
  birthday?: Date;

  constructor(profile: IUpdateProfile) {
    if (profile.address) {
      this.address = profile.address;
    }
    if (profile.name) {
      this.name = profile.name;
    }
    if (profile.birthday) {
      this.birthday = profile.birthday;
    }
  }
}
