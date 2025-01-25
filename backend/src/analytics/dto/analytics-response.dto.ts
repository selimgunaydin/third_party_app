import { ApiProperty } from '@nestjs/swagger';

export class AnalyticsResponseDto {
  @ApiProperty({
    description: 'API anahtarı',
    example: 'api_key_123',
  })
  apiKey: string;

  @ApiProperty({
    description: 'Olay adı',
    example: 'page_view',
  })
  eventName: string;

  @ApiProperty({
    description: 'Olay verileri',
    example: { page: '/home', duration: 120 },
  })
  eventData: Record<string, any>;

  @ApiProperty({
    description: 'Oturum ID',
    example: 'session_123',
  })
  sessionId: string;

  @ApiProperty({
    description: 'Kullanıcı tarayıcı bilgisi',
    example: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
  })
  userAgent: string;

  @ApiProperty({
    description: 'IP adresi',
    example: '127.0.0.1',
  })
  ipAddress: string;

  @ApiProperty({
    description: 'Referans URL',
    example: 'https://example.com',
  })
  referrer: string;

  @ApiProperty({
    description: 'Sayfa yolu',
    example: '/home',
  })
  path: string;

  @ApiProperty({
    description: 'Ek meta veriler',
    required: false,
    example: { browser: 'Chrome', platform: 'MacOS' },
  })
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'Kullanıcı ID',
    example: '507f1f77bcf86cd799439011',
  })
  userId: string;

  @ApiProperty({
    description: 'Oluşturulma tarihi',
    example: '2024-03-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Güncellenme tarihi',
    example: '2024-03-15T10:30:00.000Z',
  })
  updatedAt: Date;
} 