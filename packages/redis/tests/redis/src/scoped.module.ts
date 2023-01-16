import { Injectable, Module } from '@nestjs/common';
import { InjectRedis, RedisModule } from '../../../lib';
import { conn2, connectionUrl1, connectionUrl2 } from './options';
import Redis from 'ioredis';

@Injectable()
class ScopedService {
  constructor(
    @InjectRedis()
    private readonly client1: Redis,
    @InjectRedis(conn2)
    private readonly client2: Redis,
  ) {}
}

@Module({
  imports: [
    RedisModule.forRoot({
      connectUrl: connectionUrl1,
    }),
    RedisModule.forRootAsync({
      name: conn2,
      isGlobal: false,
      useFactory: () => ({ connectUrl: connectionUrl2 }),
    }),
  ],
  providers: [ScopedService],
})
export class ScopedModule {}

@Injectable()
class OtherService {
  constructor(
    @InjectRedis()
    private readonly client1: Redis,
    @InjectRedis(conn2) // is expected to throw error because conn2 is outside scope (isGlobal: false)
    private readonly client2: Redis,
  ) {}
}

@Module({
  providers: [OtherService],
})
export class OtherModule {}
