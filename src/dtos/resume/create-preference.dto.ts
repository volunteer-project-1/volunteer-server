import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { ICreatePreference } from "../../types";
import { PreferenceJobDto, PreferenceLocationDto } from "./lib";

export class CreatePreferenceDto implements ICreatePreference {
  @IsString()
  employType!: string | null;

  @IsNumber()
  salary!: number | null;

  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => PreferenceLocationDto)
  preferenceLocations!: PreferenceLocationDto[] | null;

  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => PreferenceJobDto)
  preferenceJobs!: PreferenceJobDto[] | null;
}
