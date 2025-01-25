import { Body, Controller, Post, UseGuards, Request, Get, Patch, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Kimlik Doğrulama')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Yeni kullanıcı kaydı' })
  @ApiResponse({ status: 201, description: 'Kullanıcı başarıyla oluşturuldu.' })
  @ApiResponse({ status: 400, description: 'Geçersiz girdi' })
  @Post('register')
  async register(@Body() createUserDto: RegisterDto) {
    return this.authService.register(createUserDto);
  }

  @ApiOperation({ summary: 'Kullanıcı girişi' })
  @ApiResponse({ status: 200, description: 'Başarılı giriş' })
  @ApiResponse({ status: 401, description: 'Geçersiz kimlik bilgileri' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Mevcut kullanıcı profilini getir' })
  @ApiResponse({ status: 200, description: 'Profil başarıyla getirildi' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user._id);
  }

  @ApiOperation({ summary: 'API anahtarı oluştur' })
  @ApiResponse({ status: 201, description: 'API anahtarı başarıyla oluşturuldu' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('generate-api-key')
  async generateApiKey(@Request() req) {
    return this.authService.generateApiKey(req.user._id);
  }

  @ApiOperation({ summary: 'API anahtarını sil' })
  @ApiResponse({ status: 200, description: 'API anahtarı başarıyla silindi' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('api-key/:apiKey/delete')
  async deleteApiKey(@Request() req, @Param('apiKey') apiKey: string) {
    return this.authService.deleteApiKey(req.user._id, apiKey);
  }
} 