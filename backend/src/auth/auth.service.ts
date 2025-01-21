import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from '../schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: any) {
    const { email, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.generateToken(user);
  }

  async login(loginDto: any) {
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
    const apiKey = uuidv4();
    await this.userModel.findByIdAndUpdate(
      userId,
      { $push: { apiKeys: apiKey } },
    );
    return { apiKey };
  }

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async deleteApiKey(userId: string, apiKey: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Must have at least one API key
    if (user.apiKeys.length <= 1) {
      throw new UnauthorizedException('You must have at least one API key');
    }

    // Delete API key
    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { apiKeys: apiKey }
    });

    return { message: 'API key deleted successfully' };
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