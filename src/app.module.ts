import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AdminModule } from "./admin/admin.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    PrismaModule,
    AdminModule,
    UsersModule,
    AuthModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
