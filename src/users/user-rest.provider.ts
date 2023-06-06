import { Injectable, ConflictException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRestProvider {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async checkBeforeUpdate(updateUserDto: UpdateUserDto, user: User) {
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const user = await this.userRepository.findOne({
        where: { username: updateUserDto.username },
      });
      if (user) {
        throw new ConflictException('Пользователь с таким ником существует');
      }
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const user = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (user) {
        throw new ConflictException('Пользователь с такой почтой существует');
      }
    }
    return updateUserDto;
  }
}
