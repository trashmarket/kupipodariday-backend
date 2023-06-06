import { MaxLength, MinLength, IsUrl, Length } from 'class-validator';

export class CreateWishDto {
  @MaxLength(250)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  price: number;

  @MinLength(1)
  @MaxLength(1024)
  description: string;
}
