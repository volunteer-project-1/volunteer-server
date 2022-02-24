import { Type } from "class-transformer";
import { ValidateNested, IsNotEmptyObject } from "class-validator";
import { HelperVideoDto } from ".";
import { IUpdateHelperVideo } from "../../types";

export class UpdateHelperVideoDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => HelperVideoDto)
  helperVideo!: Partial<HelperVideoDto>;

  constructor({ helperVideo }: IUpdateHelperVideo) {
    this.helperVideo = helperVideo;
  }
}
