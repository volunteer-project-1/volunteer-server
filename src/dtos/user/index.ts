import { IsString } from "class-validator";

export * from "./create-user-by-local.dto";
export * from "./update-my-profile.dto";

export class ProfileDto {
  @IsString()
  name!: string;

  @IsString()
  address!: string;

  @IsString()
  birthday!: string;
}
