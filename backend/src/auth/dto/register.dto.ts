import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Kullanıcının tam adı',
    example: 'John Doe'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Kullanıcının email adresi',
    example: 'john@example.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Kullanıcı şifresi (minimum 6 karakter)',
    example: 'password123'
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Telefon numarası',
    example: '+90 555 123 4567',
    required: false
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Adres bilgisi',
    example: 'İstanbul, Türkiye',
    required: false
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'Şirket adı',
    example: 'Acme Inc.',
    required: false
  })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiProperty({
    description: 'Ünvan',
    example: 'Senior Developer',
    required: false
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Kullanıcı biyografisi',
    example: 'Full-stack developer with 5 years of experience',
    required: false
  })
  @IsString()
  @IsOptional()
  bio?: string;
} 