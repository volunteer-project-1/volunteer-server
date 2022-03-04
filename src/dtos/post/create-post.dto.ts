/* eslint-disable max-classes-per-file */
import { IsDefined, IsString } from "class-validator";
import { ICreatePost } from "../../types";

export class CreatePostDto {
  @IsString()
  @IsDefined()
  type!: string;

  @IsString()
  @IsDefined()
  title!: string;

  @IsString()
  @IsDefined()
  content!: string;

  constructor({ type, title, content }: ICreatePost) {
    this.type = type;
    this.title = title;
    this.content = content;
  }
}
