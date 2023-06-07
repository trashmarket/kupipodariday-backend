import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from 'src/users/entities/user.entity';
import { Wish } from './entities/wish.entity';
import { WishesRestProvider } from './wishes-rest.provider';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishRepository: Repository<Wish>,
    private wishesRestProvider: WishesRestProvider,
    private dataSource: DataSource,
  ) {}
  create(createWishDto: CreateWishDto, user: User) {
    return this.wishRepository.save({ ...createWishDto, owner: user });
  }

  findUserWishes(query) {
    return this.wishRepository.find(query);
  }

  findlast() {
    return this.wishRepository.find({
      order: { createdAt: 'DESC' },
      take: 10,
      relations: { owner: true },
    });
  }

  findTop() {
    return this.wishRepository.find({
      order: { copied: 'DESC' },
      take: 10,
      relations: { owner: true },
    });
  }

  findOne(idWish: number) {
    return this.wishRepository.findOne({
      where: { id: idWish },
      relations: { owner: true, offers: true },
    });
  }

  copy(id: number, user: User) {
    return this.wishesRestProvider.copy(id, user);
  }

  update(id: number, updateWishDto: UpdateWishDto, user: User) {
    return this.wishesRestProvider.update(id, updateWishDto, user);
  }

  remove(id: number, user: User) {
    return this.wishesRestProvider.remove(id, user);
  }
}
