import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { TrackEventDto } from './dto/track-event.dto';
import { AnalyticsResponseDto } from './dto/analytics-response.dto';
import { AggregationResponseDto } from './dto/aggregation-response.dto';
import { SessionsResponseDto } from './dto/sessions-response.dto';
import { Analytics, IAnalytics } from '../schemas/analytics.schema';
import { EventValidationPipe } from './pipes/event-validation.pipe';
import { ValidationPipe } from '@nestjs/common';

interface RequestWithUser extends Request {
  user: {
    _id: string;
    email: string;
  };
}

@ApiTags('Analytics')
@Controller('api/analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Yeni bir analitik olayı kaydet' })
  @ApiBody({ type: TrackEventDto })
  @ApiResponse({
    status: 201,
    description: 'Olay başarıyla kaydedildi',
    type: AnalyticsResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Geçersiz istek' })
  @Post('track')
  @UsePipes(new ValidationPipe({ transform: true }), EventValidationPipe)
  async trackEvent(
    @Body() eventData: TrackEventDto,
    @Req() request: Request,
  ): Promise<AnalyticsResponseDto> {
    const user = await this.userService.findByApiKey(eventData.apiKey);
    const userAgent = request.headers['user-agent'];
    const ipAddress = request.ip;
    const referrer = request.headers.referer || '';
    const path = request.headers.origin || '';

    const result = await this.analyticsService.trackEvent({
      ...eventData,
      userAgent,
      ipAddress,
      referrer,
      path,
      userId: user._id.toString(),
    });

    return this.mapToAnalyticsResponse(result);
  }

  @ApiOperation({ summary: 'Belirli bir tarih aralığındaki olayları getir' })
  @ApiQuery({
    name: 'apiKey',
    required: true,
    description: 'API anahtarı',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Başlangıç tarihi (ISO formatında)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Bitiş tarihi (ISO formatında)',
  })
  @ApiResponse({
    status: 200,
    description: 'Olaylar başarıyla getirildi',
    type: [AnalyticsResponseDto],
  })
  @UseGuards(JwtAuthGuard)
  @Get('events')
  async getEvents(
    @Req() req: RequestWithUser,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<AnalyticsResponseDto[]> {
    const events = await this.analyticsService.getEventsByUserId(
      req.user._id,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );

    return events.map((event) => this.mapToAnalyticsResponse(event));
  }

  @ApiOperation({ summary: 'Olay agregasyonlarını getir' })
  @ApiQuery({
    name: 'apiKey',
    required: true,
    description: 'API anahtarı',
  })
  @ApiQuery({
    name: 'startDate',
    required: true,
    description: 'Başlangıç tarihi (ISO formatında)',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    description: 'Bitiş tarihi (ISO formatında)',
  })
  @ApiResponse({
    status: 200,
    description: 'Agregasyonlar başarıyla getirildi',
    type: AggregationResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('aggregations')
  async getAggregations(
    @Query('apiKey') apiKey: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<AggregationResponseDto> {
    const events = await this.analyticsService.getEventAggregations(
      apiKey,
      new Date(startDate),
      new Date(endDate),
    ) as IAnalytics[];

    const eventTypes = events.reduce((acc, event) => {
      acc[event.eventName] = (acc[event.eventName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dailyEvents = events.reduce((acc, event) => {
      const date = event.createdAt.toISOString().split('T')[0];
      const existingDay = acc.find((d) => d.date === date);
      if (existingDay) {
        existingDay.count++;
      } else {
        acc.push({ date, count: 1 });
      }
      return acc;
    }, [] as Array<{ date: string; count: number }>);

    const uniqueSessions = new Set(events.map((e) => e.sessionId)).size;

    return {
      totalEvents: events.length,
      eventDistribution: eventTypes,
      dailyDistribution: dailyEvents,
      uniqueSessions,
    };
  }

  @ApiOperation({ summary: 'Oturum sayısını getir' })
  @ApiQuery({
    name: 'apiKey',
    required: true,
    description: 'API anahtarı',
  })
  @ApiQuery({
    name: 'startDate',
    required: true,
    description: 'Başlangıç tarihi (ISO formatında)',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    description: 'Bitiş tarihi (ISO formatında)',
  })
  @ApiResponse({
    status: 200,
    description: 'Oturum sayısı başarıyla getirildi',
    type: SessionsResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('sessions')
  async getSessionsCount(
    @Query('apiKey') apiKey: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<SessionsResponseDto> {
    const sessions = await this.analyticsService.getUserSessionsCount(
      apiKey,
      new Date(startDate),
      new Date(endDate),
    );
    return { count: sessions.length };
  }

  private mapToAnalyticsResponse(analytics: Analytics): AnalyticsResponseDto {
    const obj = analytics.toObject();
    return {
      ...obj,
      createdAt: obj.createdAt || new Date(),
      updatedAt: obj.updatedAt || new Date(),
    };
  }
} 