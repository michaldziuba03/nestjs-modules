import { Module } from '@nestjs/common';
import { PingController } from './ping.controller';
import { PingService } from './ping.service';

@Module({
  providers: [PingService],
  controllers: [PingController],
})
export class PingModule {}
