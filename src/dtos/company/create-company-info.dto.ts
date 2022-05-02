import {
  IsString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsNotEmpty,
} from "class-validator";

export class CreateCompanyInfoDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  introduce!: string;

  @IsNotEmpty()
  @IsString()
  founded_at!: string;

  @IsNotEmpty()
  @IsNumber()
  member!: number;

  @IsOptional()
  @IsNumber()
  acc_investment?: number;

  @IsOptional()
  @IsString()
  homepage?: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  phone_number!: string;

  @IsNotEmpty()
  @IsString()
  address!: string;

  @IsOptional()
  @IsString()
  industry_type?: string;
}
