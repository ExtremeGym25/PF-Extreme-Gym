import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsNumber,
  Validate,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { MatchPassword } from '../../helpers/matchPassword';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$^&*])/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  @MinLength(8)
  @MaxLength(15)
  password?: string;

  @IsOptional()
  @Validate(MatchPassword, ['password'])
  confirmPassword?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  address?: string;

  @IsOptional()
  @IsNumber()
  phone?: number;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  country?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  city?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  @MaxLength(2048)
  profileImage?: string;
}
