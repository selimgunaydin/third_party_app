import { IsString, IsNotEmpty, IsEthereumAddress } from 'class-validator';

export class LoginDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  signature: string;
} 