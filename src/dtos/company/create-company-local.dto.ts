import {
  IsString,
  IsNotEmpty,
  Matches,
  MinLength,
  IsEmail,
} from "class-validator";
import { IsNotBlank, Match } from "../../decorators";

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

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsString()
  @Match("password")
  passwordConfirm: string;

  constructor({
    email,
    password,
    passwordConfirm,
    name,
  }: {
    email: string;
    password: string;
    passwordConfirm: string;
    name: string;
  }) {
    this.email = email;
    this.password = password;
    this.passwordConfirm = passwordConfirm;
    this.name = name;
  }
}
