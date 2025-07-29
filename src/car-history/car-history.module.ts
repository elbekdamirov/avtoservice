import { Module } from "@nestjs/common";
import { CarHistoryService } from "./car-history.service";
import { CarHistoryController } from "./car-history.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [CarHistoryController],
  providers: [CarHistoryService],
})
export class CarHistoryModule {}
