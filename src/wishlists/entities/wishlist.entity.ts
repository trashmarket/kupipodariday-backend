import { Entity, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { MaxLength, MinLength } from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { GeneralEntity } from 'src/general-entity';

@Entity()
export class Wishlist extends GeneralEntity {
  @MaxLength(250)
  @MinLength(1)
  @Column()
  name: string;

  @Column({
    length: 1500,
  })
  description: string;

  @Column()
  image: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  user: User;
}
