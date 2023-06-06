import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtGuard } from 'src/guards/jwt-guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { UserDecorator } from 'src/decorator/user.decorator';
import { User } from './entities/user.entity';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('find')
  findMany(@Body() findUsersDto: FindUsersDto) {
    return this.usersService.findMany(findUsersDto.query);
  }

  @Get('me')
  findMe(@Req() req) {
    return req.user;
  }

  @Get('me/wishes')
  findMyWishes(@UserDecorator() user: User) {
    return this.usersService.findWishes(user);
  }

  @Get(':username/wishes')
  findUserWishes(@Param('username') username: string) {
    return this.usersService.findUserWishes(username);
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findOne({
      where: { username },
    });
  }

  @Patch('me')
  update(@Body() updateUserDto: UpdateUserDto, @UserDecorator() user) {
    return this.usersService.update(updateUserDto, user);
  }
}
