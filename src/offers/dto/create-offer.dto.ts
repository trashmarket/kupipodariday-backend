import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateOfferDto {
  @IsNotEmpty()
  readonly amount: number;

  @IsNotEmpty()
  @IsBoolean()
  readonly hidden: boolean;

  @IsNotEmpty()
  readonly itemId: number;
}
