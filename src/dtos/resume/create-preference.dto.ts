import { ICreatePreference } from "../../types";
import { PreferenceJobDto, PreferenceLocationDto } from "./lib";

export class CreatePreferenceDto implements ICreatePreference {
  employType!: string | null;

  salary!: number | null;

  //   @IsOptional()
  //   @ValidateNested({ each: true })
  //   @ArrayMinSize(1)
  //   @Type(() => PreferenceLocationDto)
  preferenceLocations!: PreferenceLocationDto[] | null;

  //   @IsOptional()
  //   @ValidateNested({ each: true })
  //   @ArrayMinSize(1)
  //   @Type(() => PreferenceJobDto)
  preferenceJobs!: PreferenceJobDto[] | null;
}
