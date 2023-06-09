import { Injectable } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    private wishesService: WishesService,
    @InjectRepository(Wishlist) private wishlist: Repository<Wishlist>,
  ) {}
  async create(createWishlistDto: CreateWishlistDto, user: User) {
    const wishes = await this.wishesService.findUserWishes({
      where: { id: In(createWishlistDto.itemsId), owner: { id: user.id } },
    });
  }

  findAll() {
    return `This action returns all wishlists`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wishlist`;
  }

  update(id: number, updateWishlistDto: UpdateWishlistDto) {
    return `This action updates a #${id} wishlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} wishlist`;
  }
}
