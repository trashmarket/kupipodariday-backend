import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStratage } from './local-stratagy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStratagy } from './jwt.stratagy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configservice: ConfigService) => ({
        secret: configservice.get('jwtsecret'),
        signOptions: { expiresIn: '2 days' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStratage, JwtStratagy],
})
export class AuthModule {}
