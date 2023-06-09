import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    private wishesService: WishesService,
    @InjectRepository(Wishlist) private wishlist: Repository<Wishlist>,
  ) {}
  async create(createWishlistDto: CreateWishlistDto, user: User) {
    if (!createWishlistDto.itemsId.length) {
      throw new BadRequestException('Вы должны выбрать хоть одно желание!');
    }

    const wishes = await this.wishesService.findUserWishes({
      where: { id: In(createWishlistDto.itemsId), owner: { id: user.id } },
    });

    if (wishes.length !== createWishlistDto.itemsId.length) {
      throw new BadRequestException('Собранные желание не совпадают с вашими');
    }

    return this.wishlist.save({
      name: createWishlistDto.name,
      image: createWishlistDto.image,
      items: wishes,
      owner: user,
    });
  }

  findAll() {
    return this.wishlist.find({
      relations: { items: true, owner: true },
    });
  }

  findOne(id: number) {
    return this.wishlist.findOne({
      where: { id },
      relations: { items: true, owner: true },
    });
  }

  async update(id: number, createWishlistDto: CreateWishlistDto, user: User) {
    const list = await this.wishlist.findOne({
      where: { id, owner: { id: user.id } },
      relations: { items: true, owner: true },
    });

    if (!list) {
      throw new NotFoundException(
        'Такого вишлиста нет или он не прендлежит вам',
      );
    }

    if (!createWishlistDto.itemsId.length) {
      throw new BadRequestException('Вы должны выбрать хоть одно желание!');
    }

    const newWishes = await this.wishesService.findUserWishes({
      where: { id: In(createWishlistDto.itemsId), owner: { id: user.id } },
    });

    if (newWishes.length !== createWishlistDto.itemsId.length) {
      throw new BadRequestException('Собранные желание не совпадают с вашими');
    }

    return this.wishlist.save({
      ...list,
      ...createWishlistDto,
      items: newWishes,
    });
  }

  async remove(id: number, user: User) {
    const list = await this.wishlist.findOne({
      where: { id, owner: { id: user.id } },
    });

    if (!list) {
      throw new ForbiddenException('Вы не можете удалить этот лист');
    }

    return this.wishlist.remove(list);
  }
}
