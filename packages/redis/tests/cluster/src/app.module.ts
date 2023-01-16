import { Module } from '@nestjs/common';
import { RedisClusterModule } from '../../../lib';
import { nodes } from './options';
import { PingModule } from './ping/ping.module';

@Module({
  imports: [
    RedisClusterModule.forRoot({
      nodes,
    }),
    PingModule,
  ],
})
export class AppModule {}
