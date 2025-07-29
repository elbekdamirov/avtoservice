import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../types";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  "access-jwt"
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.USER_ACCESS_TOKEN_KEY!,
      passReqToCallback: true, // o'quv maqsadida
    });
  }

  validate(
    req: Request, // o'quv maqsadida
    payload: JwtPayload
  ): JwtPayload {
    return payload; // req.user = payload
  }
}
