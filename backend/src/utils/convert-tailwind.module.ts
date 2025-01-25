import { Module } from '@nestjs/common';
import { ConvertTailwindController } from './convert-tailwind.controller';
import { ConvertTailwindService } from './convert-tailwind.service';

@Module({
  controllers: [ConvertTailwindController],
  providers: [ConvertTailwindService],
  exports: [ConvertTailwindService],
})
export class ConvertTailwindModule {}
