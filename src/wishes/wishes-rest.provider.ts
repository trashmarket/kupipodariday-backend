import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Wish } from './entities/wish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesRestProvider {
  constructor(
    @InjectRepository(Wish) private wishRepository: Repository<Wish>,
    private dataSource: DataSource,
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

  async copy(id: number, user: User) {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: { owner: true, offers: true },
    });

    const wishesMy = await this.wishRepository.find({
      where: { id: user.id },
    });

    const findclone = wishesMy.some(
      (item) => item.name === wish.name && wish.image == item.image,
    );

    if (findclone) {
      throw new ForbiddenException('Такое желание вы уже клонировали!');
    }

    if (wish.owner.id === user.id) {
      throw new ForbiddenException('Вы не можете скопировать свое желание!');
    }

    const { name, link, image, price, description } = wish;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      wish.copied++;
      let newCopy = queryRunner.manager.create(Wish, {
        name,
        link,
        image,
        price,
        description,
        raised: 0,
        owner: user,
      });
      await queryRunner.manager.save(wish);
      newCopy = await queryRunner.manager.save(newCopy);
      await queryRunner.commitTransaction();
      return newCopy;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    }
  }
}
