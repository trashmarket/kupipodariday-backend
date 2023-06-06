import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, Like } from 'typeorm';
import { User } from './entities/user.entity';
import { hashingPass } from 'src/utils/general-utils';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRestProvider } from './user-rest.provider';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private userRestProvider: UserRestProvider,
    private wishesService: WishesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    await hashingPass(createUserDto);
    return await this.userRepository.save(createUserDto);
  }

  async findMany(query: string) {
    return await this.userRepository.find({
      where: [{ username: Like(`%${query}%`) }, { email: query }],
    });
  }

  async findOne(query: FindOneOptions<User>): Promise<User | null> {
    return await this.userRepository.findOne(query);
  }

  async update(updateUserDto: UpdateUserDto, user: User) {
    const userUpdate = await this.userRestProvider.checkBeforeUpdate(
      updateUserDto,
      user,
    );
    await hashingPass(userUpdate);
    return this.userRepository.save({ ...user, ...userUpdate });
  }

  findUserWishes(username: string) {
    return this.wishesService.findUserWishes({
      where: { owner: { username } },
    });
  }

  async findWishes(user: User) {
    return this.wishesService.findUserWishes({
      where: { owner: { id: user.id } },
      relations: { owner: true, offers: true },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
