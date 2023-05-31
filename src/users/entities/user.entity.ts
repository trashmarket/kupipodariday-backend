import { Entity, Column, OneToMany } from 'typeorm';
import {
  MaxLength,
  MinLength,
  IsUrl,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { GeneralEntity } from 'src/general-entity';
import { Offer } from 'src/offers/entities/offer.entity';

@Entity()
export class User extends GeneralEntity {
  @Column({
    unique: true,
  })
  @MinLength(2)
  @MaxLength(30)
  @IsNotEmpty()
  username: string;

  @Column({
    default: 'Пока ничего не рассказал о себе',
  })
  @MinLength(2)
  @MaxLength(200)
  about: string;

  @Column({
    default: 'https://i.pravatar.cc/300',
  })
  @IsUrl()
  avatar: string;

  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Wish, (whish) => whish.owner)
  wishes: Wish[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlists: Wishlist[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];
}
