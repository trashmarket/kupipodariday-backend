import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { OfferRestProvider } from './offer-rest.provider';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private offerRepository: Repository<Offer>,
    private offerRestProvider: OfferRestProvider,
  ) {}

  create(createOfferDto: CreateOfferDto, user: User) {
    return this.offerRestProvider.create(createOfferDto, user);
  }

  findAll() {
    return this.offerRepository.find({
      where: { hidden: false },
      relations: { user: true, item: true },
    });
  }

  findOne(id: number) {
    return this.offerRepository.findOne({
      where: { id, hidden: false },
      relations: { user: true, item: true },
    });
  }

  // update(id: number, updateOfferDto: UpdateOfferDto) {
  //   return `This action updates a #${id} offer`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} offer`;
  // }
}
