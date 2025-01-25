import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EventName, EventData } from './event-types';

export class TrackEventDto {
  @ApiProperty({
    description: 'API anahtarı',
    example: 'api_key_123',
  })
  @IsNotEmpty()
  apiKey: string;

  @ApiProperty({
    description: 'Olay adı',
    enum: EventName,
    example: EventName.PAGE_VIEW,
  })
  @IsEnum(EventName)
  eventName: EventName;

  @ApiProperty({
    description: 'Olay verileri',
    example: {
      title: 'Ana Sayfa',
      url: 'https://example.com',
      path: '/',
      referrer: 'https://google.com',
    },
  })
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  eventData: EventData;

  @ApiProperty({
    description: 'Oturum ID',
    example: 'session_123',
  })
  @IsNotEmpty()
  sessionId: string;

  @ApiProperty({
    description: 'Ek meta veriler',
    required: false,
    example: { browser: 'Chrome', platform: 'MacOS' },
  })
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  metadata?: Record<string, any>;
} 