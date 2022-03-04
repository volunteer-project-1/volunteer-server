/* eslint-disable max-classes-per-file */
import { IsNumber, IsString } from "class-validator";

export * from "./create-post.dto";

export class PostDto {
  @IsNumber()
  id!: number;

  @IsNumber()
  user_id!: number;

  @IsNumber()
  seq!: number;

  @IsString()
  type!: string;

  @IsNumber()
  view_count!: number;

  @IsString()
  title!: string;

  @IsString()
  content!: string;
}
