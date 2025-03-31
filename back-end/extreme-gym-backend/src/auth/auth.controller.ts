import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '../users/dto/create-user.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  singup(@Body() user: CreateUserDto) {
    return this.authService.createUser(user);
  }
  @Post('/signin')
  singIn(@Body() credentials: LoginUserDto) {
    return this.authService.signIn(credentials);
  }

  @Get('/auth0/protected')
  getAuth0Protected(@Req() req: Request) {
    // Verifica si el usuario está autenticado
    const isAuthenticated = req.oidc?.isAuthenticated?.();

    if (!isAuthenticated) {
      return { message: 'No autenticado' };
    }

    console.log('Access Token:', req.oidc?.accessToken);
    return req.oidc?.user;
  }
}
