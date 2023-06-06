import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Wish } from './entities/wish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesRestProvider {
  constructor(
    @InjectRepository(Wish) private wishRepository: Repository<Wish>,
  ) {}

  async update(id: number, updateWishDto: UpdateWishDto, user: User) {
    if (Object.keys(updateWishDto).length === 0) {
      throw new BadRequestException('Не выбраны параметры! ');
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
      throw new ForbiddenException('Нельзя удалять чужое желание');
    }

    return this.wishRepository.remove(wish);
  }
}
