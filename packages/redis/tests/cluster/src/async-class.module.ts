import { Module } from '@nestjs/common';
import {
  ClusterOptionsFactory,
  IORedisClusterOptions,
  RedisClusterModule,
} from '../../../lib';
import { nodes } from './options';
import { PingModule } from './ping/ping.module';

class ConfigService implements ClusterOptionsFactory {
  async createClusterOptions(): Promise<IORedisClusterOptions> {
    return {
      nodes,
    };
  }
}

@Module({
  imports: [
    RedisClusterModule.forRootAsync({
      useClass: ConfigService,
    }),
    PingModule,
  ],
})
export class AsyncClassModule {}
