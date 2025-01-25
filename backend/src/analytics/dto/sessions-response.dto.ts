import { ApiProperty } from '@nestjs/swagger';

export class SessionsResponseDto {
  @ApiProperty({
    description: 'Toplam oturum sayısı',
    example: 750,
  })
  count: number;
} 