import { Injectable, ConflictException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignupDto } from './dto/signup.dto';
import { compareHashingPass } from 'src/utils/general-utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userServise: UsersService,
    private jwtService: JwtService,
  ) {}

  auth(id: string) {
    const payload = { sub: id };

    return { access_token: this.jwtService.sign(payload) };
  }

  async registerUser(UserDto: SignupDto) {
    const checkUser = await this.userServise.findOne({
      where: { username: UserDto.username },
    });

    if (checkUser) {
      throw new ConflictException('Пользователь с таким именем уже существует');
    }

    return this.userServise.create(UserDto);
  }

  async validatePassword(username: string, password: string) {
    const user = await this.userServise.findOne({
      where: { username: username },
    });

    if (!user) {
      return null;
    }

    const checkPassword = compareHashingPass(password, user.password);
    if (!checkPassword) {
      return null;
    }

    return user;
  }
}
