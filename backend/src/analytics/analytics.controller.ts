import { Controller, Post, Get, Body, Query, Req, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  async trackEvent(
    @Body() eventData: {
      websiteId: string;
      eventName: string;
      eventData: Record<string, any>;
      userId?: string;
      sessionId: string;
      metadata?: Record<string, any>;
    },
    @Req() request: Request,
  ) {
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
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('events')
  async getEvents(
    @Query('websiteId') websiteId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return await this.analyticsService.getEventsByWebsiteId(
      websiteId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-events')
  async getUserEvents(
    @Query('websiteId') websiteId: string,
    @Query('userId') userId: string,
  ) {
    return await this.analyticsService.getEventsByUserId(websiteId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('aggregations')
  async getAggregations(
    @Query('websiteId') websiteId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.analyticsService.getEventAggregations(
      websiteId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('sessions')
  async getSessionsCount(
    @Query('websiteId') websiteId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const sessions = await this.analyticsService.getUserSessionsCount(
      websiteId,
      new Date(startDate),
      new Date(endDate),
    );
    return { count: sessions.length };
  }
} 