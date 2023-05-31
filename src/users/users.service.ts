import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, Like } from 'typeorm';
import { User } from './entities/user.entity';
import { hashingPass } from 'src/utils/general-utils';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
