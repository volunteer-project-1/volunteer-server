import { Type } from "class-transformer";
import { ValidateNested, IsNotEmptyObject } from "class-validator";
import { MyVideoDto } from ".";
import { IUpdateMyVideo } from "../../types";

export class UpdateMyVideoDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => MyVideoDto)
  myVideo!: Partial<MyVideoDto>;

  constructor({ myVideo }: IUpdateMyVideo) {
    this.myVideo = myVideo;
  }
}
