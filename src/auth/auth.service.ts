import { UsersService } from './../users/users.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/resgister.dto';
import { loginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register({ name, email, password }: RegisterDto) {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      throw new BadRequestException('User already exists');
    }
    return await this.usersService.create({
      name,
      email,
      password: await bcryptjs.hash(password, 10),
    });
  }

  async login({ email, password }: loginDto) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email is wrong');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is wrong');
    }

    return user;
  }
}
