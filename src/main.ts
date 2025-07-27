import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import * as cookieParser from "cookie-parser";

async function start() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.setGlobalPrefix("api");
  app.use(cookieParser());

  const PORT = config.get<number>("PORT");
  await app.listen(PORT ?? 3030, () => {
    console.log(`Server running on port: ${PORT}`);
  });
}

start();
