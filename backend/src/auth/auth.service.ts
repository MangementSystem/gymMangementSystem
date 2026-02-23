import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from '../core/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, ...userData } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      ...userData,
      role: userData.role || 'member',
    });

    await this.userRepository.save(user);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['organization'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (user.status !== 'active') {
      throw new UnauthorizedException('Account is not active');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password2, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...result } = user;
      return result as User;
    }

    return null;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['organization'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getProfile(userId: number) {
    const user = await this.findById(userId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private generateTokens(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(userId: number) {
    const user = await this.findById(userId);
    return this.generateTokens(user);
  }
}
