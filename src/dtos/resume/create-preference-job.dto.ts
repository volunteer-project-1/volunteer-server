import { IsString } from "class-validator";
import { ICreatePreferenceJob } from "../../types";

export class CreatePreferenceJobDto implements ICreatePreferenceJob {
  @IsString()
  name!: string | null;
}
