import { IsString } from "class-validator";
import { ICreatePreferenceLocation } from "../../types";

export class CreatePreferenceLocationDto implements ICreatePreferenceLocation {
  @IsString()
  sido!: string | null;

  @IsString()
  sigungu!: string | null;
}
