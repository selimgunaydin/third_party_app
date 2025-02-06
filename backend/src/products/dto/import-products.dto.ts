import { IsNotEmpty, IsString } from 'class-validator';

export class ImportProductsDto {
  @IsString()
  @IsNotEmpty()
  xmlContent: string;
} 