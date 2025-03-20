import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, UserLogInDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt/dist';


@Injectable()
export class AuthService {

  constructor(@InjectRepository(User) private readonly usersRepository : Repository<User>, private jwtService : JwtService ){}

  async createUser(user: CreateUserDto) {
    
    const {email, password, confirmPassword, ...userWithoutConfirmation} = user
    
    const finduser = await this.usersRepository.findOneBy({email})
    if (finduser) throw new BadRequestException('user already registered')



    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await this.usersRepository.save({
        ...userWithoutConfirmation, 
        password : hashedPassword,
        email: email,
        isAdmin: false,
        premium: false,
        
    }); 
    const { password: _, isAdmin, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
    }

    async signIn(credentials : UserLogInDto){
      const {email, password,} = credentials

      const finduser = await this.usersRepository.findOneBy({email})
      if (!finduser) throw new BadRequestException('bad credentials')

      const passwordMatch = await bcrypt.compare(password, finduser.password)
      if (!passwordMatch) throw new BadRequestException('bad credentials')
      
          const userPayload = {
              id : finduser.id,
              email: finduser.email,
              isAdmin: finduser.isAdmin,
              
              
          }
      const token = this.jwtService.sign(userPayload)

      return {
          token,
          message : 'Success'
      }
  }

  
}
