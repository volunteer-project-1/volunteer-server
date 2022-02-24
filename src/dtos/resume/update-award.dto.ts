import { Type } from "class-transformer";
import { ValidateNested, IsNotEmptyObject } from "class-validator";
import { AwardDto } from ".";
import { IUpdateAward } from "../../types";

export class UpdateAwardDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => AwardDto)
  award!: Partial<AwardDto>;

  constructor({ award }: IUpdateAward) {
    this.award = award;
  }
}
