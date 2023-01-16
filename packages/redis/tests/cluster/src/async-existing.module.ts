import { Injectable, Module } from '@nestjs/common';
import {
  ClusterOptionsFactory,
  IORedisClusterOptions,
  RedisClusterModule,
} from '../../../lib';
import { nodes } from './options';
import { PingModule } from './ping/ping.module';

@Injectable()
class ConfigService implements ClusterOptionsFactory {
  async createClusterOptions(): Promise<IORedisClusterOptions> {
    return {
      nodes,
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
    RedisClusterModule.forRootAsync({
      imports: [ConfigModule],
      useExisting: ConfigService,
    }),
    PingModule,
  ],
})
export class AsyncExistingModule {}
