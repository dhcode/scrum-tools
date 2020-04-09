import { NestFactory } from '@nestjs/core';
import { ServerModule } from './server.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ServerModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableShutdownHooks();
  await app.listen(3000);
}
bootstrap();
