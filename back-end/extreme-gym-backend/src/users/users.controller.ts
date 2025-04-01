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
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from './entities/user.entity';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { Role } from './entities/roles.enum';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios retornada exitosamente.',
  })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID del usuario a obtener',
  })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('profile')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 2 * 1024 * 1024 } }),
  )
  @ApiOperation({ summary: 'Actualizar la imagen de perfil de un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Imagen de perfil actualizada exitosamente.',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permiso para realizar esta acción',
  })
  async uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId: string,
    @Request() req,
  ): Promise<Omit<User, 'password' | 'isAdmin' | 'subscriptionType'> | null> {
    const currentUser = req.user;
    if (currentUser.id !== userId && !currentUser.isAdmin) {
      throw new ForbiddenException(
        'No tienes permiso para subir una imagen de perfil para este usuario',
      );
    }

    const user = await this.usersService.profileFindById(userId);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (file) {
      user.profileImage = await this.fileUploadService.uploadProfilePicture(
        file,
        user.id,
      );
    } else {
      user.profileImage =
        user.profileImage ||
        'https://res.cloudinary.com/dixcrmeue/image/upload/v1743014544/xTREME_GYM_1_ivgi8t.png';
    }

    return await this.usersService.profileUpdate(user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario por ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID del usuario a actualizar',
  })
  @ApiBody({
    description: 'Datos del usuario a actualizar',
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente.',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permiso para realizar esta acción',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    const currentUser = req.user;
    if (currentUser.id !== id && !currentUser.isAdmin) {
      throw new ForbiddenException(
        'No tienes permiso para actualizar este usuario',
      );
    }

    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario por ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID del usuario a eliminar',
  })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente.' })
  @ApiResponse({
    status: 403,
    description: 'No tienes permiso para realizar esta acción',
  })
  
  async deleteUser(
    @Param('id') userId: string,
    @Request() req,
  ): Promise<{ message: string }> {
    const currentUser = req.user;

    if (currentUser.id !== userId && !currentUser.isAdmin) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar este usuario',
      );
    }

    await this.usersService.remove(userId);
    return {
      message: `El usuario con ID "${userId}" ha sido marcado como inactivo.`,
    };
  }
}
