import { IsString, IsNotEmpty } from "class-validator";
import { ICreateUserByLocal } from "../../types";

export class CreateUserByLocalDto {
  @IsNotEmpty()
  @IsString()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  constructor({ email, password }: ICreateUserByLocal) {
    this.email = email;
    this.password = password;
  }
}
