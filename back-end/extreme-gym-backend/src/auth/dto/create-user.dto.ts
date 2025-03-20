import {
        IsNotEmpty, 
        IsString, 
        IsEmail, 
        Length, 
        Matches, 
        IsNumber, 
        Validate,
        } from 'class-validator';
import { MatchPassword } from '../helpers/matchPassword';
import { URL } from 'url';


export class CreateUserDto {
    
    @IsNotEmpty()
    @IsString()
    @Length(5, 50)
    name: string;

    
    @IsNotEmpty()
    @IsEmail()
    email: string;

    
    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,30}$/,
        { message: 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*).' })
    password: string; 

    @IsNotEmpty()
    @Validate(MatchPassword, ['password'])
    confirmPassword: string;

    @IsNotEmpty()
    @IsString()
    @Length(3, 80)
    address: string;

    
    @IsNotEmpty()
    @IsNumber()
    phone: number;

    @IsNotEmpty()
    @IsString()
    @Length(2, 20)
    country: string;

    @IsNotEmpty()
    @IsString()
    @Length(5, 20)
    city: string;

    profileImage: URL
}

export class UserLogInDto {
    
    @IsNotEmpty()
    @IsEmail()
    email: string;

    
    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/,
        { message: 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*).' })
    password: string;
}



