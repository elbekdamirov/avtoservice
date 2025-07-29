import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { SigninUserDto } from "src/users/dto/signin-user.dto";
import { Request, Response } from "express";
import { ResponseFields } from "src/common/types";
import { RefreshTokenGuard } from "src/common/guards";
import { GetCurrentUser, GetCurrentUserId } from "src/common/decorators";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post("signin")
  async signin(@Body() signinUserDto: SigninUserDto) {
    return this.authService.signin(signinUserDto);
  }

  @Post("verify-otp")
  verifyOtp(
    @Body("email") email: string,
    @Body("otp") otp: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseFields> {
    return this.authService.verifyOtp(email, otp, res);
  }

  @UseGuards(RefreshTokenGuard)
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  refresh(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseFields> {
    return this.authService.refreshTokens(+userId, refreshToken, res);
  }

  @UseGuards(RefreshTokenGuard)
  @Post("signout")
  async logout(
    @GetCurrentUserId() userId: number,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signout(+userId, res);
  }
}
