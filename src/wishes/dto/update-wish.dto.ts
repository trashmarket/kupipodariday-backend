import {
  MaxLength,
  MinLength,
  IsUrl,
  Length,
  IsOptional,
} from 'class-validator';

export class UpdateWishDto {
  @IsOptional()
  @MaxLength(250)
  name: string;

  @IsOptional()
  @IsUrl()
  link: string;

  @IsOptional()
  @IsUrl()
  image: string;

  @IsOptional()
  price: number;

  @IsOptional()
  @MinLength(1)
  @MaxLength(1024)
  description: string;
}
