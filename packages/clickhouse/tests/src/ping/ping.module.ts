import { Module } from '@nestjs/common';
import { PingService } from './ping.service';
import { PingController } from './ping.controller';

@Module({
  providers: [PingService],
  controllers: [PingController],
})
export class PingModule {}
