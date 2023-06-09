import { IsUrl, IsNotEmpty, Length, ArrayNotEmpty } from 'class-validator';

export class CreateWishlistDto {
  @IsNotEmpty()
  @Length(1, 250)
  name: string;

  @IsUrl()
  image: string;

  @ArrayNotEmpty()
  itemsId: number[];
}
