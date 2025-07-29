import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { UsersService } from "src/users/users.service";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { MailService } from "src/mail/mail.service";
import { generateOtp } from "src/utils/otp.util";
import { SigninUserDto } from "src/users/dto/signin-user.dto";
import { Request, request, Response } from "express";
import { ResponseFields, Tokens } from "src/common/types";

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly mailService: MailService
  ) {}

  private async generateTokens(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      is_approved: user.is_approved,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.USER_ACCESS_TOKEN_KEY,
        expiresIn: process.env.USER_ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.USER_REFRESH_TOKEN_KEY,
        expiresIn: process.env.USER_REFRESH_TOKEN_TIME,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async signup(dto: CreateUserDto) {
    const { full_name, phone, email, role } = dto;
    const existingUser = await this.prismaService.users.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException("This email is already registered");
    }

    const activationLink = uuidv4();

    const user = await this.prismaService.users.create({
      data: {
        full_name,
        phone,
        email,
        role,
        activation_link: activationLink,
      },
    });

    await this.mailService.sendActivationEmail(user.email, activationLink);

    return { message: "Check your email for activation link" };
  }

  async signin(dto: SigninUserDto) {
    const { email } = dto;
    const user = await this.prismaService.users.findUnique({
      where: { email },
    });
    if (!user) throw new NotFoundException("User not found");

    const otp = generateOtp();

    await this.prismaService.users.update({
      where: { email },
      data: {
        otp_code: otp,
        otp_expires_at: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    await this.mailService.sendOtp(email, otp);
    return { message: "OTP sent to email" };
  }

  async verifyOtp(
    email: string,
    otp: string,
    res: Response
  ): Promise<ResponseFields> {
    if (!email) {
      throw new BadRequestException("Email is required");
    }

    const user = await this.prismaService.users.findUnique({
      where: { email },
    });
    if (!user || user.otp_code !== otp) {
      throw new BadRequestException("Invalid OTP");
    }

    if (new Date() > user.otp_expires_at!) {
      throw new BadRequestException("OTP expired");
    }

    await this.prismaService.users.update({
      where: { email },
      data: {
        otp_code: null,
        otp_expires_at: null,
      },
    });

    const { accessToken, refreshToken } = await this.generateTokens(user);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 7);

    await this.prismaService.users.update({
      where: { email },
      data: { refreshToken: hashedRefreshToken },
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: Number(process.env.USER_COOKIE_TIME),
    });

    return { message: "OTP verified", accessToken, userId: user.id };
  }

  async activateUser(link: string) {
    const user = await this.prismaService.users.findFirst({
      where: {
        activation_link: link,
      },
    });

    if (!user) {
      throw new BadRequestException("Activation link is invalid");
    }

    if (user.is_active) {
      return { message: "User already activated" };
    }

    await this.prismaService.users.update({
      where: { id: user.id },
      data: {
        is_active: true,
        activation_link: null,
      },
    });
    return { message: "Account successfully activated" };
  }

  async refreshTokens(userId: number, refreshToken: string, res: Response) {
    const user = await this.prismaService.users.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshToken) {
      throw new ForbiddenException("AccessDenied1");
    }

    const rtMatches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!rtMatches) throw new ForbiddenException("AccessDenied2");

    const tokens: Tokens = await this.generateTokens(user);
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 7);
    await this.prismaService.users.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: +process.env.USER_COOKIE_TIME!,
      httpOnly: true,
    });

    return {
      message: "Tokenlar yangilandi",
      userId: user.id,
      accessToken: tokens.accessToken,
    };
  }

  async signout(userId: number, res: Response) {
    const user = await this.prismaService.users.updateMany({
      where: {
        id: userId,
        refreshToken: {
          not: null,
        },
      },
      data: {
        refreshToken: null,
      },
    });
    if (!user) throw new ForbiddenException("Access denied");
    res.clearCookie("refreshToken");
    return { message: "User signed out" };
  }
}
