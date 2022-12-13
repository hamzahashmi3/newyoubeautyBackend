import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api/v1/');
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (error: any) => new BadRequestException(error),
    }),
  );
  await app
    .listen(process.env.PORT || 3055)
    .then(() => console.log(`Server running on ${process.env.PORT}`));
}

bootstrap();