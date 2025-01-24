import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: '*', // Geliştirme aşamasında tüm originlere izin ver
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  const port = parseInt(process.env.PORT || '5000', 10);
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
bootstrap();
