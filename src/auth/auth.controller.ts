import { Body, Controller, Get, Post } from '@nestjs/common';
import { Request } from 'express';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import * as userActivateInterface from 'src/common/interfaces/user-activate.interface';
import { Role } from '../common/enums/rol.enums';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorators';
import { loginDto } from './dto/login.dto';
import { RegisterDto } from './dto/resgister.dto';

interface RequestWithUser extends Request {
  user: { email: string; role: string };
}
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Body()
    registerDto: RegisterDto,
  ) {
    console.log(registerDto);
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(
    @Body()
    loginDto: loginDto,
  ) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @Auth(Role.USER)
  profile(@ActiveUser() user: userActivateInterface.UserActiveInterface) {
    console.log(user);
    return this.authService.profile(user);
  }

  // sin decorador sin applyDecorators
  //@Get('profile')
  // @Roles(Role.USER)
  // @UseGuards(AuthGuard, RolesGuard)
  // profile(@Req() req: RequestWithUser) {
  //   return this.authService.profile(req.user);
  // }
}
