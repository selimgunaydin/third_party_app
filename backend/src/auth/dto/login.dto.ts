import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'E-posta adresi',
    example: 'test@test.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Şifre',
    example: '123456'
  })
  @IsString()
  @IsNotEmpty()
  password: string;
} 