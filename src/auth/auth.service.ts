import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}
  async register({ email, name, password }: RegisterDto) {
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    if (user) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPass = await hash(password, 12);
    const newUser = await this.prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPass,
      },
    });

    const token = await this.jwt.sign(
      { id: newUser.id },
      {
        secret: this.config.get('JWT_SECRET_KEY'),
        expiresIn: this.config.get('JWT_EXPIRATION'),
      },
    );
    return { data: token };
  }

  async login({ email, password }: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid email or password');
    }
    const token = await this.jwt.sign(
      { id: user.id },
      {
        secret: this.config.get('JWT_SECRET_KEY'),
        expiresIn: this.config.get('JWT_EXPIRATION'),
      },
    );
    return { data: token };
  }
}
