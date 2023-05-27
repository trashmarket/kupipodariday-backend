import { Entity, Column, BeforeInsert, ManyToOne } from 'typeorm';
import { GeneralEntity } from 'src/general-entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { checkFloat } from 'src/utils/general-utils';

@Entity()
export class Offer extends GeneralEntity {
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column()
  amount: number;

  @Column({
    default: false,
  })
  hidden: boolean;
}
