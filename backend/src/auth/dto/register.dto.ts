import { IsString, IsNotEmpty, IsEthereumAddress, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsNotEmpty()
  signature: string;
} 