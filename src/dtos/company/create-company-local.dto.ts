import {
  IsString,
  IsNotEmpty,
  Matches,
  MinLength,
  IsEmail,
} from "class-validator";
import { IsNotBlank, Match } from "../../decorators";
import { ICreateUserByLocal } from "../../types";

export class CreateCompanyByLocalDto {
  @IsNotEmpty()
  @IsNotBlank("email")
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsNotBlank("password")
  @MinLength(10)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d,.@$!%*?&]{10,}$/,
    {
      message:
        "Password too weak, Min length 10, at least one capital letter, one lowercase letter, one number and one special character",
    }
  )
  password: string;

  @IsString()
  @Match("password")
  passwordConfirm: string;

  constructor({ email, password, passwordConfirm }: ICreateUserByLocal) {
    this.email = email;
    this.password = password;
    this.passwordConfirm = passwordConfirm;
  }
}
