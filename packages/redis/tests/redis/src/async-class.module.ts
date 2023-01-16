import { RedisOptionsFactory, IORedisOptions, RedisModule } from '../../../lib';
import { Module } from '@nestjs/common';
import { conn2, connectionUrl1, connectionUrl2 } from './options';
import { PingModule } from './ping/ping.module';

class ConfigService implements RedisOptionsFactory {
  createRedisOptions(): IORedisOptions {
    return {
      connectUrl: connectionUrl1,
    };
  }
}

@Module({
  imports: [
    RedisModule.forRootAsync({
      useClass: ConfigService,
    }),
    RedisModule.forRoot({
      name: conn2,
      connectUrl: connectionUrl2,
    }),
    PingModule,
  ],
})
export class AsyncClassModule {}
