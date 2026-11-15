import "reflect-metadata";
import { RequestMethod } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { apiPort } from "./config";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.setGlobalPrefix("api/v1", {
    exclude: [{ path: "mcp", method: RequestMethod.ALL }],
  });
  await app.listen(apiPort());
}

void bootstrap();