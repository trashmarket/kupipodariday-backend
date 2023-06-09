import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from 'src/guards/jwt-guard';
import { UserDecorator } from 'src/decorator/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ExcludePassUserOfferInterceptor } from 'src/interseptors';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @UseInterceptors(ExcludePassUserOfferInterceptor)
  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createOfferDto: CreateOfferDto, @UserDecorator() user: User) {
    return this.offersService.create(createOfferDto, user);
  }

  @UseInterceptors(ExcludePassUserOfferInterceptor)
  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @UseInterceptors(ExcludePassUserOfferInterceptor)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.offersService.findOne(id);
  }
}
