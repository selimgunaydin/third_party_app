import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ComponentsModule } from './components/components.module';
import { WidgetModule } from './widget/widget.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || ''),
    AuthModule,
    ComponentsModule,
    WidgetModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_PIPE',
      useFactory: () => ({
        cors: {
          origin: process.env.FRONTEND_URL,
          credentials: true,
        },
      }),
    },
  ],
})
export class AppModule {}
