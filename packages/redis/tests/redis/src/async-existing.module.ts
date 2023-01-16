import { IORedisOptions, RedisModule, RedisOptionsFactory } from '../../../lib';
import { Module } from '@nestjs/common';
import { conn2, host, port1, port2 } from './options';
import { PingModule } from './ping/ping.module';

class ConfigService implements RedisOptionsFactory {
  async createRedisOptions(): Promise<IORedisOptions> {
    return {
      host,
      port: port1,
    };
  }
}

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
class ConfigModule {}

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useExisting: ConfigService,
    }),
    RedisModule.forRoot({
      name: conn2,
      host,
      port: port2,
    }),
    PingModule,
  ],
})
export class AsyncExistingModule {}
