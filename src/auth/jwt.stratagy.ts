import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStratagy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secret',
    });
  }
  async validate(payload: { sub: number }) {
    const user = this.userService.findOne({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('пользователь не авторизован');
    }

    return user;
  }
}
