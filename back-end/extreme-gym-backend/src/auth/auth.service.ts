import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from '../users/dto/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt/dist';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Subscription } from 'src/payments/entities/payment.entity';
import { NotificationsService } from '../notifications/notifications.service';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createUser(user: CreateUserDto) {
    const { email, password, confirmPassword, ...userWithoutConfirmation } =
      user;

    const finduser = await this.usersRepository.findOneBy({ email });
    if (finduser) throw new BadRequestException('user already registered');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.usersRepository.save({
      ...userWithoutConfirmation,
      password: hashedPassword,
      email: email,
      isAdmin: false,
      premium: false,
    });

    await this.notificationsService.sendWelcomeEmail(
      newUser.email,
      newUser.name,
    );


    const { password: _, isAdmin, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async signIn(credentials: LoginUserDto) {
    const { email, password } = credentials;

    const finduser = await this.usersRepository.findOneBy({ email });
    if (!finduser) throw new BadRequestException('bad credentials');

      const passwordMatch = await bcrypt.compare(password, finduser.password)
      if (!passwordMatch) throw new BadRequestException('bad credentials')
      
      if (!finduser.isActive) {
        throw new BadRequestException('Usuario inactivo');
            }
          const userPayload = {
              id : finduser.id,
              email: finduser.email,
              isAdmin: finduser.isAdmin, 
          }
      const token = this.jwtService.sign(userPayload)
          const { password: _, ...userWithoutPassword } = finduser;
    return {
      token,
      user : userWithoutPassword,
      message: 'Success',
    };
  }
}
