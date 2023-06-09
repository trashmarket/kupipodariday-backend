import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { Offer } from './entities/offer.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OfferRestProvider {
  constructor(
    @InjectRepository(Offer) private offerRepository: Repository<Offer>,
    private wishService: WishesService,
    private dataSource: DataSource,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User) {
    const wishForOffer = await this.wishService.findOne(createOfferDto.itemId);

    if (wishForOffer.id === user.id) {
      throw new ForbiddenException('Вы не можете скинуться на свое желание');
    }

    if (wishForOffer.raised === wishForOffer.price) {
      throw new ForbiddenException('сумма собрана!');
    }

    const cost = wishForOffer.raised + createOfferDto.amount;

    if (wishForOffer.price < cost) {
      const manyNeed = wishForOffer.price - wishForOffer.raised;
      throw new ForbiddenException(`Вам нужно внести ровно ${manyNeed}`);
    }

    wishForOffer.raised = cost;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(wishForOffer);
      let offer = queryRunner.manager.create(Offer, {
        user,
        item: wishForOffer,
        amount: cost,
        hidden: createOfferDto.hidden,
      });
      offer = await queryRunner.manager.save(offer);
      await queryRunner.commitTransaction();
      return offer;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    }
  }
}
