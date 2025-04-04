import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    const users = await this.userRepository.find();
    return users.map(({ password, isAdmin, ...user }) => user);
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    const { password, isAdmin, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{
    message: string;
    user: Omit<User, 'password' | 'isAdmin' | 'subscriptionType'>;
  }> {
    const existingUser = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!existingUser) {
      throw new NotFoundException(`El usuario con ID "${userId}" no existe.`);
    }
    if (updateUserDto.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser && existingUser.id !== userId) {
        throw new BadRequestException(
          'El email ya está en uso por otro usuario',
        );
      }
    }
    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      updateUserDto.password = hashedPassword;
    }

    Object.assign(existingUser, updateUserDto);

    const savedUser = await this.userRepository.save(existingUser);
    const { password, isAdmin, ...userWithoutSensitiveData } = savedUser;

    return {
      message: `El usuario "${savedUser.name}" ha sido actualizado correctamente.`,
      user: userWithoutSensitiveData,
    };
  }

  async profileFindById(userId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async profileUpdate(
    user: User,
  ): Promise<Omit<User, 'password' | 'isAdmin' | 'subscriptionType'> | null> {
    const savedUser = await this.userRepository.save(user);
    const { password, isAdmin, ...userWithoutSensitiveData } = savedUser;
    return userWithoutSensitiveData;
  }

  async remove(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`El usuario con ID "${userId}" no existe.`);
    }

    user.isActive = false;
    await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findProfile(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
}
