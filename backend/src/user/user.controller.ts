import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.userService.findById(req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Request() req, @Body() updateData: any) {
    return this.userService.update(req.user._id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('preferences')
  async updatePreferences(@Request() req, @Body() preferences: any) {
    return this.userService.updatePreferences(req.user._id, preferences);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('status')
  async updateStatus(@Request() req, @Body('status') status: string) {
    return this.userService.updateStatus(req.user._id, status);
  }
} 