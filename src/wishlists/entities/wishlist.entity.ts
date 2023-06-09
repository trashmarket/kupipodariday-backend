import { Entity, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { MaxLength, MinLength, IsUrl } from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { GeneralEntity } from 'src/general-entity';

@Entity()
export class Wishlist extends GeneralEntity {
  @MaxLength(250)
  @MinLength(1)
  @Column()
  name: string;

  @IsUrl()
  @Column()
  image: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
