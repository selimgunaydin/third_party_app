import { IsString, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';

export class CreateWidgetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUrl()
  @IsNotEmpty()
  endpoint: string;

  @IsString()
  @IsOptional()
  apiKey?: string;

  @IsString()
  @IsNotEmpty()
  method: string;
} 