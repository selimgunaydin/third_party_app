import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Req,
  UseGuards,
  UsePipes,
  Param,
  Logger,
  ParseIntPipe,
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
  ApiQuery
} from '@nestjs/swagger';
import { TrackEventDto } from './dto/track-event.dto';
import { AnalyticsResponseDto } from './dto/analytics-response.dto';
import { Analytics } from '../schemas/analytics.schema';
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
  private readonly logger = new Logger(AnalyticsController.name);

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

  @Get('most-viewed-products')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'En çok görüntülenen ürünleri getirir' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Kaç ürün getirileceği',
  })
  @ApiResponse({ status: 200, description: 'Başarılı' })
  @ApiResponse({ status: 401, description: 'Yetkisiz erişim' })
  async getMostViewedProducts(
    @Req() req: RequestWithUser,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    const limitValue = limit || 10;
    return this.analyticsService.getMostViewedProducts(req.user._id, limitValue);
  }

  @Get('most-added-to-cart')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'En çok sepete eklenen ürünleri getirir' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Kaç ürün getirileceği',
  })
  @ApiResponse({ status: 200, description: 'Başarılı' })
  async getMostAddedToCartProducts(
    @Req() req: RequestWithUser,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    const limitValue = limit || 10;
    return this.analyticsService.getMostAddedToCartProducts(req.user._id, limitValue);
  }

  @Get('order-statistics')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Sipariş istatistiklerini getirir' })
  @ApiResponse({ status: 200, description: 'Başarılı' })
  async getOrderStatistics(@Req() req: RequestWithUser) {
    return this.analyticsService.getOrderStatistics(req.user._id);
  }

  @Get('time-based')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Zamana dayalı analitik verileri getirir' })
  @ApiQuery({
    name: 'days',
    required: false,
    type: Number,
    description: 'Kaç günlük veri getirileceği',
  })
  @ApiResponse({ status: 200, description: 'Başarılı' })
  async getTimeBasedAnalytics(
    @Req() req: RequestWithUser,
    @Query('days', new ParseIntPipe({ optional: true })) days?: number,
  ) {
    const daysValue = days || 30;
    return this.analyticsService.getTimeBasedAnalytics(req.user._id, daysValue);
  }

  @Get('page-duration')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Sayfa bazlı süre istatistiklerini getirir' })
  @ApiQuery({
    name: 'path',
    required: false,
    type: String,
    description: 'Belirli bir sayfa yolu için filtreleme',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Başlangıç tarihi (ISO formatında)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Bitiş tarihi (ISO formatında)',
  })
  @ApiResponse({ status: 200, description: 'Başarılı' })
  async getPageDurationStats(
    @Req() req: RequestWithUser,
    @Query('path') path?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getPageDurationStats(
      req.user._id,
      path,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('page-duration/:path')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Belirli bir sayfa için detaylı süre bilgilerini getirir' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Kaç kayıt getirileceği',
  })
  @ApiResponse({ status: 200, description: 'Başarılı' })
  async getDetailedPageDuration(
    @Req() req: RequestWithUser,
    @Param('path') path: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    const limitValue = limit || 100;
    return this.analyticsService.getDetailedPageDuration(req.user._id, path, limitValue);
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