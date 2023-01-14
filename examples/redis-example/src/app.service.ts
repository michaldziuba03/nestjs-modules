import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { InjectRedis } from '@mich4l/nestjs-redis';

@Injectable()
export class AppService {
  constructor(@InjectRedis('conn1') private readonly redis: Redis) {}

  setHello() {
    return this.redis.set('hello', 'Hello World');
  }

  async getHello() {
    const hello = await this.redis.get('hello');
    if (!hello) {
      this.setHello();
      return this.getHello();
    }

    return hello;
  }
}
