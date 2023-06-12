import {
  Injectable,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository, Not } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRestProvider {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async checkBeforeUpdate(updateUserDto: UpdateUserDto, user: User) {
    if (
      Object.keys(updateUserDto).length <= 2 &&
      updateUserDto.username &&
      updateUserDto.username === user.username &&
      updateUserDto.email === user.email
    ) {
      throw new ForbiddenException(
        'вы передали тоже самое имя и почту без изменений',
      );
    }
    if (
      (updateUserDto.username && updateUserDto.username !== user.username) ||
      (updateUserDto.email && updateUserDto.email !== user.email)
    ) {
      const existingUser = await this.userRepository.findOne({
        where: [
          { id: Not(user.id), username: updateUserDto.username },
          { id: Not(user.id), email: updateUserDto.email },
        ],
      });

      if (existingUser) {
        throw new ConflictException(
          'Пользователь с таким email или username уже зарегистрирован',
        );
      }
    }
    return updateUserDto;
  }
}
