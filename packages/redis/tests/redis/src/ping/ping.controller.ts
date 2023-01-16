import { Controller, Get } from '@nestjs/common';
import { PingService } from './ping.service';

@Controller()
export class PingController {
  constructor(private readonly pingService: PingService) {}

  @Get('pong')
  getPong() {
    return this.pingService.getPong();
  }
}
