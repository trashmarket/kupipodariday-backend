import {
  MaxLength,
  MinLength,
  IsUrl,
  IsEmail,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsUrl()
  readonly avatar: string;

  @IsOptional()
  readonly about: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
