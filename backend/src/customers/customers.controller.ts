import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  async getCustomers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.customersService.getCustomersList(page, limit);
  }

  @Get(':userId/analytics')
  async getCustomerAnalytics(@Param('userId') userId: string) {
    return this.customersService.getCustomerAnalytics(userId);
  }
} 