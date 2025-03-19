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
  ): Promise<{ message: string; user: User }> {
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

    return {
      message: `El usuario "${savedUser.name}" ha sido actualizado correctamente.`,
      user: savedUser,
    };
  }

  async remove(userId: string): Promise<{ message: string }> {
    const existingUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException(
        `El usuario con ID "${userId}" no existe en la BDD.`,
      );
    }

    await this.userRepository.remove(existingUser);

    return {
      message: `El usuario "${existingUser.name}" ha sido eliminado correctamente.`,
    };
  }
}
