import { ApiProperty } from '@nestjs/swagger';

export class AggregationResponseDto {
  @ApiProperty({
    description: 'Toplam olay sayısı',
    example: 1500,
  })
  totalEvents: number;

  @ApiProperty({
    description: 'Olay türlerine göre dağılım',
    example: {
      page_view: 1000,
      button_click: 300,
      form_submit: 200,
    },
  })
  eventDistribution: Record<string, number>;

  @ApiProperty({
    description: 'Günlük olay dağılımı',
    example: [
      { date: '2024-03-15', count: 500 },
      { date: '2024-03-16', count: 450 },
      { date: '2024-03-17', count: 550 },
    ],
  })
  dailyDistribution: Array<{ date: string; count: number }>;

  @ApiProperty({
    description: 'Benzersiz oturum sayısı',
    example: 750,
  })
  uniqueSessions: number;
} 