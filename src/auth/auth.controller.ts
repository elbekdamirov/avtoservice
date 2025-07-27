import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { SigninUserDto } from "src/users/dto/signin-user.dto";
import { Request, Response } from "express";

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
  ) {
    return this.authService.verifyOtp(email, otp, res);
  }

  @Post("refresh")
  refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies.refreshToken;
    return this.authService.refreshTokens(refreshToken, res);
  }

  @Post("signout")
  async logout(@Req() req: Request, @Res() res: Response) {
    return this.authService.signout(req, res);
  }
}
