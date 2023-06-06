import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, Like } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from 'src/users/entities/user.entity';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishRepository: Repository<Wish>,
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

  async update(id: number, updateWishDto: UpdateWishDto, user: User) {
    if (Object.keys(updateWishDto).length === 0) {
      throw new BadRequestException('Не выбраны параметры ');
    }

    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: { owner: true, offers: true },
    });

    if (wish.owner.id !== user.id) {
      throw new ForbiddenException('Вы неможет редактировать чужое желание');
    }

    if (updateWishDto.price && wish.raised) {
      throw new ForbiddenException(
        'Вы неможет редактировать цену так как есть желающие скинуться',
      );
    }

    return this.wishRepository.save({ ...wish, ...updateWishDto });
  }

  async remove(id: number, user: User) {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: { owner: true, offers: true },
    });

    if (wish.owner.id !== user.id) {
      throw new ForbiddenException('Нельзя удалять чужое жедание');
    }

    return this.wishRepository.remove(wish);
  }
}
