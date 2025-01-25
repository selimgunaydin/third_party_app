import { Body, Controller, Post, UseGuards, Request, Get, Patch, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: RegisterDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('generate-api-key')
  async generateApiKey(@Request() req) {
    return this.authService.generateApiKey(req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('api-key/:apiKey/delete')
  async deleteApiKey(@Request() req, @Param('apiKey') apiKey: string) {
    return this.authService.deleteApiKey(req.user._id, apiKey);
  }
} 