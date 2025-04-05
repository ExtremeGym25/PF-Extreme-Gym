import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '../users/dto/create-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Response } from 'express'; 

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error al registrar el usuario.' })
  singup(@Body() user: CreateUserDto) {
    return this.authService.createUser(user);
  }
  @Post('/signin')
  @ApiOperation({ summary: 'Iniciar sesión de un usuario existente' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso.' })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas.' })
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

  // endpoitn de next auth

  @Post('oauth/callback')
  async handleOAuthCallback(
    @Body() body: { profile: any; provider: string },
    @Res() res: Response,
  ) {
    try {
      const { user, accessToken } = await this.authService.validateOAuthLogin(
        body.profile,
        body.provider,
      );

      return res.status(HttpStatus.OK).json({
        user,
        accessToken,
      });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'OAuth authentication failed',
        error: error.message,
      });
    }
  }
}
