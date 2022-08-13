import { IsString } from "class-validator";
import { ICreateActivity } from "../../types";

export class CreateActivityDto implements ICreateActivity {
  @IsString()
  organization!: string | null;

  @IsString()
  description!: string | null;
}
