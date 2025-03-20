import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from '../users/dto/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(
    user: CreateUserDto,
  ): Promise<Omit<User, 'password' | 'isAdmin'>> {
    const { email, password, confirmPassword, ...userWithoutConfirmation } =
      user;

    const finduser = await this.usersRepository.findOneBy({ email });

    if (finduser) throw new BadRequestException('user already registered');
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.usersRepository.save({
      ...userWithoutConfirmation,
      password: hashedPassword,
      email,
      isAdmin: false,
    });
    const { password: _, isAdmin, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
}
