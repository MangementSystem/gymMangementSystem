import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../core/decorators/current-user.decorator';
import { Public } from '../core/decorators/public.decorator';
import type { JwtPayload } from '../core/interfaces/jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: JwtPayload) {
    return this.authService.getProfile(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refreshToken(@CurrentUser() user: JwtPayload) {
    return this.authService.refreshToken(user.sub);
  }
}
