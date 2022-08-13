import { IsString } from "class-validator";
import { ICreateHelperVideo } from "../../types";

export class CreateHelperVideoDto implements ICreateHelperVideo {
  @IsString()
  url!: string | null;
}
