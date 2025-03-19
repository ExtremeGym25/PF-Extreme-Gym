import { Controller, Post, Body,} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, UserLogInDto} from './dto/create-user.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  singup(@Body() user: CreateUserDto ){
    return this.authService.createUser(user)
  }
  @Post('/signin')
  singIn(@Body() credentials: UserLogInDto){
    
    return this.authService.signIn(credentials)
  }
}
