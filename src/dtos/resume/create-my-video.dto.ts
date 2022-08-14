import { IsString } from "class-validator";
import { ICreateMyVideo } from "../../types";

export class CreateMyVideoDto implements ICreateMyVideo {
  @IsString()
  url!: string | null;
}
