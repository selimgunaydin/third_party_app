import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { ComponentsModule } from './components/components.module';
import { WidgetModule } from './widget/widget.module';
import { ConvertTailwindModule } from './utils/convert-tailwind.module';
import { UserModule } from './user/user.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || ''),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'src'),
      serveRoot: '/api/scripts',
      serveStaticOptions: {
        index: false,
        extensions: ['js'],
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/public',
      serveStaticOptions: {
        index: false,
      },
    }),
    AuthModule,
    ComponentsModule,
    WidgetModule,
    ConvertTailwindModule,
    UserModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
