import { Controller, Post, Get, Body, Query, Req, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserService } from 'src/user/user.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly userService: UserService,
  ) {}

  @Post('track')
  async trackEvent(
    @Body() eventData: {
      apiKey: string;
      eventName: string;
      eventData: Record<string, any>;
      sessionId: string;
      metadata?: Record<string, any>;
    },
    @Req() request: Request,
  ) {
    const user = await this.userService.findByApiKey(eventData.apiKey);
    const userAgent = request.headers['user-agent'];
    const ipAddress = request.ip;
    const referrer = request.headers.referer || '';
    const path = request.headers.origin || '';

    return await this.analyticsService.trackEvent({
      ...eventData,
      userAgent,
      ipAddress,
      referrer,
      path,
      userId: user._id.toString(),
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('events')
  async getEvents(
    @Query('apiKey') apiKey: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return await this.analyticsService.getEventsByApiKey(
      apiKey,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('aggregations')
  async getAggregations(
    @Query('apiKey') apiKey: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.analyticsService.getEventAggregations(
      apiKey,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('sessions')
  async getSessionsCount(
    @Query('apiKey') apiKey: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const sessions = await this.analyticsService.getUserSessionsCount(
      apiKey,
      new Date(startDate),
      new Date(endDate),
    );
    return { count: sessions.length };
  }
} 