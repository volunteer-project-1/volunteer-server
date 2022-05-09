import {
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from "class-validator";

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(8000)
  introduce?: string;

  @IsOptional()
  @IsString()
  @IsDateString()
  founded_at?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  member?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  acc_investment?: number;

  @IsOptional()
  @IsString()
  @IsUrl()
  homepage?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  industry_type?: string;
}
