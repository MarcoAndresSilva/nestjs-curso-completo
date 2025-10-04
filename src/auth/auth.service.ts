import { UsersService } from './../users/users.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/resgister.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register({ name, email, password }: RegisterDto) {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      throw new BadRequestException('User already exists');
    }
    return await this.usersService.create({ name, email, password });
  }

  login() {
    return 'login';
  }
}
