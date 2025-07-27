import { forwardRef, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { MailModule } from "src/mail/mail.module";

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => UsersModule),
    JwtModule.register({}),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
