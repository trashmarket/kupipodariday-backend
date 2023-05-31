import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LocalGuard } from 'src/guards/local.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @UseGuards(LocalGuard)
  sinngin(@Req() req) {
    const { id } = req.user;
    return this.authService.auth(id);
  }

  @Post('signup')
  singup(@Body() signupDto: SignupDto) {
    return this.authService.registerUser(signupDto);
  }
}
