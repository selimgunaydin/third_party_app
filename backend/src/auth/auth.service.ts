import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from '../schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: RegisterDto) {
    const { email, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // API anahtarı oluştur
    const apiKey = uuidv4();
    
    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
      apiKeys: [{ key: apiKey, isActive: true }]
    });
    
    return {
      ...(await this.generateToken(user)),
      apiKey
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  async generateApiKey(userId: string) {
    const key = uuidv4();
    await this.userModel.findByIdAndUpdate(
      userId,
      { $push: { apiKeys: { key, isActive: true } } },
    );
    return { apiKey: key };
  }

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async deleteApiKey(userId: string, keyToDelete: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if this is the last active key
    const activeKeys = user.apiKeys.filter(k => k.isActive);
    const targetKey = user.apiKeys.find(k => k.key === keyToDelete);

    if (!targetKey) {
      throw new NotFoundException('API key not found');
    }

    // If this is the last active key and we're trying to deactivate it
    if (activeKeys.length <= 1 && targetKey.isActive) {
      throw new UnauthorizedException('You must have at least one active API key');
    }

    // Toggle the key status
    await this.userModel.updateOne(
      { _id: userId, 'apiKeys.key': keyToDelete },
      { $set: { 'apiKeys.$.isActive': false } }
    );

    return { message: 'API key status updated successfully' };
  }

  private generateToken(user: any) {
    const payload = { id: user._id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
    };
  }
} 