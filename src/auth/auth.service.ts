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
    await this.usersService.create({
      name,
      email,
      password: await bcryptjs.hash(password, 10),
    });

    return {
      name,
      email,
    };
  }

  // autenticacion: es cuando las credenciales y el password sean correctos le devolvemos el token
  // y la autorización : es cuando queramos visitar una ruta que sea con autenticacion(privilegios) es usuario que tine el token es el que va a poder acceder
  async login({ email, password }: loginDto) {
    const user = await this.usersService.findOneByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('Email is wrong');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is wrong');
    }

    const payload = { email: user.email, role: user.role }; // en el payload le decimos que datos van a viajar en el token
    const token = await this.jwtService.signAsync(payload);

    return {
      user,
      token,
      email,
    };
  }

  async profile({ email, role }: { email: string; role: string }) {
    // if (role !== 'admin') { esta bien pero es peresoso si tengo mil endpoints qeu encesiten rtol de admin apra entrar entonces hjay que manejarlo de otra manera como el auth guard
    //   throw new UnauthorizedException('You are not an admin');
    // }
    return await this.usersService.findOneByEmail(email);
  }
}
// TODO roels segunda parte actualizar todo para que compile
