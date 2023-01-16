import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { InjectRedis } from '../../../../lib';
import { conn2 } from '../options';

@Injectable()
export class PingService {
  constructor(
    @InjectRedis()
    private readonly client1: Redis,
    @InjectRedis(conn2)
    private readonly client2: Redis,
  ) {}

  async getPong() {
    const pong1 = await this.client1.ping();
    const pong2 = await this.client1.ping();

    const success = pong1 === 'PONG' && pong1 === pong2;

    return { success, pong: pong1 };
  }
}
