import {
  BadRequestException,
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
    const user = await this.prismaService.users.findFirst({
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

  async verifyOtp(email: string, otp: string, res: Response) {
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

    return { message: "OTP verified", accessToken };
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

  async refreshTokens(refreshToken: string, res: Response) {
    if (!refreshToken) {
      throw new BadRequestException("Refresh token is required");
    }
    let userData: any;
    try {
      userData = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.USER_REFRESH_TOKEN_KEY,
      });
    } catch (err) {
      throw new BadRequestException("Invalid refresh token");
    }
    const user = await this.prismaService.users.findUnique({
      where: { id: userData.id },
    });

    if (!user || !user.refreshToken) {
      throw new BadRequestException("Access denied");
    }

    const isValid = bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValid) {
      throw new BadRequestException("Refresh token mismatch");
    }

    const tokens = await this.generateTokens(user);
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 7);

    await this.prismaService.users.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: Number(process.env.USER_COOKIE_TIME),
    });

    res
      .status(200)
      .json({ message: "User refreshed", accessToken: tokens.accessToken });
  }

  async signout(req: Request, res: Response) {
    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken) {
      return res.status(200).send({ message: "Already logged out" });
    }

    res.clearCookie("refreshToken");
    return res.status(200).send({ message: "Successfully logged out" });
  }
}
