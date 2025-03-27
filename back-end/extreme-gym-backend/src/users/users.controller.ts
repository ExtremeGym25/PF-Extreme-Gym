import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from './entities/user.entity';
import { FileUploadService } from 'src/file-upload/file-upload.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Post('profile')  
  @UseInterceptors(  
    FileInterceptor('file', { limits: { fileSize: 2 * 1024 * 1024 } }),  
  )  
  async uploadProfileImage(@UploadedFile() file: Express.Multer.File, @Body('userId') userId: string): Promise<User | null> {  
    const user = await this.usersService.profileFindById(userId);  
    
    if (!user) {  
      throw new Error('Usuario no encontrado');  
    }  
 
    if (file) { 
      user.profileImage = await this.fileUploadService.uploadProfilePicture(file, user.id)
      console.log(user.profile);
      
    } else {  
      // Si no se carga una imagen, se mantendrá la imagen por defecto  
      user.profileImage =
        user.profileImage ||
        'https://res.cloudinary.com/dixcrmeue/image/upload/v1743014544/xTREME_GYM_1_ivgi8t.png';
    }

    return await this.usersService.profileUpdate(user);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') userId: string): Promise<{ message: string }> {
    await this.usersService.remove(userId);
    return {
      message: `El usuario con ID "${userId}" ha sido marcado como inactivo.`,
    };
  }
}
