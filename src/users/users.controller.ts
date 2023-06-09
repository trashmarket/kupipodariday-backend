import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from 'src/guards/jwt-guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { UserDecorator } from 'src/decorator/user.decorator';
import { User } from './entities/user.entity';
import {
  ExcludePassUserInterceptor,
  ExcludePassOwnerInterceptor,
} from 'src/interseptors';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseInterceptors(ExcludePassUserInterceptor)
  @Post('find')
  findMany(@Body() findUsersDto: FindUsersDto) {
    return this.usersService.findMany(findUsersDto.query);
  }

  @UseInterceptors(ExcludePassUserInterceptor)
  @Get('me')
  findMe(@Req() req) {
    return req.user;
  }

  @UseInterceptors(ExcludePassOwnerInterceptor)
  @Get('me/wishes')
  findMyWishes(@UserDecorator() user: User) {
    return this.usersService.findWishes(user);
  }

  @UseInterceptors(ExcludePassOwnerInterceptor)
  @Get(':username/wishes')
  findUserWishes(@Param('username') username: string) {
    return this.usersService.findUserWishes(username);
  }

  @UseInterceptors(ExcludePassUserInterceptor)
  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findOne({
      where: { username },
    });
  }

  @UseInterceptors(ExcludePassUserInterceptor)
  @Patch('me')
  update(@Body() updateUserDto: UpdateUserDto, @UserDecorator() user) {
    return this.usersService.update(updateUserDto, user);
  }
}
