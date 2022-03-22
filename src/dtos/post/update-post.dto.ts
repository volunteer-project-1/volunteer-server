/* eslint-disable max-classes-per-file */
import { IsNotEmptyObject, ValidateNested } from "class-validator";
import { IUpdatePost } from "../../types";
import { PostDto } from ".";
import { Type } from "class-transformer";

export class UpdatePostDto {
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PostDto)
    post!: Partial<PostDto>;

  constructor({ post }: IUpdatePost) {
    this.post = post;
  }
}
