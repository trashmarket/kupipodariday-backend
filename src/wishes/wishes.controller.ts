import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/guards/jwt-guard';
import { UserDecorator } from 'src/decorator/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ExcludePassOwnerInterceptor } from 'src/interseptors';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}
  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @UserDecorator() user: User) {
    return this.wishesService.create(createWishDto, user);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  @UseGuards(JwtGuard)
  copy(@Param('id') id: number, @UserDecorator() user: User) {
    return this.wishesService.copy(id, user);
  }

  @UseInterceptors(ExcludePassOwnerInterceptor)
  @Get('top')
  findTop() {
    return this.wishesService.findTop();
  }

  @UseInterceptors(ExcludePassOwnerInterceptor)
  @Get('last')
  finLast() {
    return this.wishesService.findlast();
  }

  @UseInterceptors(ExcludePassOwnerInterceptor)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishesService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @UserDecorator() user: User,
  ) {
    return this.wishesService.update(id, updateWishDto, user);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @UserDecorator() user: User) {
    return this.wishesService.remove(id, user);
  }
}
