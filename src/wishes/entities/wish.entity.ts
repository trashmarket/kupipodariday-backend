import { Entity, Column, BeforeInsert, ManyToOne, OneToMany } from 'typeorm';
import { MaxLength, MinLength, IsUrl } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { GeneralEntity } from 'src/general-entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { checkFloat } from 'src/utils/general-utils';

@Entity()
export class Wish extends GeneralEntity {
  @Column({
    length: 250,
  })
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column()
  price: number;

  @Column()
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column()
  @MinLength(1)
  @MaxLength(1024)
  description: string;

  @Column()
  copied: number;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @BeforeInsert()
  InsertFloat() {
    this.price = checkFloat(this.price);
    this.raised = checkFloat(this.raised);
  }
}
