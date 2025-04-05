import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from '../users/dto/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt/dist';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Subscription } from 'src/payments/entities/payment.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';
import { Account } from './entities/account.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private jwtService: JwtService,
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
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
      profileImage:
        'https://res.cloudinary.com/dixcrmeue/image/upload/v1743014544/xTREME_GYM_1_ivgi8t.png',
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

    const passwordMatch = await bcrypt.compare(password, finduser.password);
    if (!passwordMatch) throw new BadRequestException('bad credentials');

    if (!finduser.isActive) {
      throw new BadRequestException('Usuario inactivo');
    }

    const user = await this.usersService.findProfile(finduser.id);

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
    const userPayload = {
      id: finduser.id,
      email: finduser.email,
      isAdmin: finduser.isAdmin,
    };
    const token = this.jwtService.sign(userPayload);
    const { password: _, ...userWithoutPassword } = finduser;
    return {
      token,
      user: userWithoutPassword,
      message: 'Success',
    };
  }

  // perfiles de inicio de sesion por terceros

  private generateJwt(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      provider: user.provider,
    };

    return this.jwtService.sign(payload);
  }

  async validateOAuthLogin(
    profile: any,
    provider: string,
  ): Promise<{ user: User; accessToken: string }> {
    // 1. Buscar usuario por email
    const user = await this.usersRepository.findOne({
      where: { email: profile.email },
      relations: ['accounts'],
    });

    // 2. Si el usuario existe
    if (user) {
      // Verificar si ya tiene esta cuenta vinculada
      const accountExists = user.accounts.some(
        (acc) =>
          acc.provider === provider && acc.providerAccountId === profile.sub,
      );

      // Si no existe, crear la cuenta
      if (!accountExists) {
        const newAccount = this.accountRepository.create({
          type: 'oauth',
          provider,
          providerAccountId: profile.sub,
          access_token: profile.accessToken,
          expires_at: profile.expires_in,
          token_type: profile.token_type,
          scope: profile.scope,
          user,
        });
        await this.accountRepository.save(newAccount);
      }

      // Actualizar datos del usuario si es necesario
      if (!user.provider || user.provider !== provider) {
        user.provider = provider;
        if (profile.picture) user.profileImage = profile.picture;
        await this.usersRepository.save(user);
      }

      // Generar JWT
      const accessToken = this.generateJwt(user);
      return { user, accessToken };
    }

    // 3. Si el usuario no existe, crearlo
    const newUser = this.usersRepository.create({
      email: profile.email,
      name: profile.name || profile.email.split('@')[0],
      profileImage: profile.picture,
      provider,
      isActive: true,
    });

    const savedUser = await this.usersRepository.save(newUser);

    // Crear cuenta asociada
    const newAccount = this.accountRepository.create({
      type: 'oauth',
      provider,
      providerAccountId: profile.sub,
      access_token: profile.accessToken,
      expires_at: profile.expires_in,
      token_type: profile.token_type,
      scope: profile.scope,
      user: savedUser,
    });
    await this.accountRepository.save(newAccount);

    // Generar JWT
    const accessToken = this.generateJwt(savedUser);
    return { user: savedUser, accessToken };
  }
}
