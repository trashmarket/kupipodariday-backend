import { IsOptional, Length, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @Length(2, 30)
  @IsOptional()
  username: string;

  @IsOptional()
  avatar: string;

  @IsOptional()
  about: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  password: string;
}
