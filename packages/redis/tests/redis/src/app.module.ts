import { Module } from '@nestjs/common';
import { RedisModule } from '../../../lib';
import { conn2, host, port1, connectionUrl2 } from './options';
import { PingModule } from './ping/ping.module';

@Module({
  imports: [
    RedisModule.forRoot({
      host,
      port: port1,
    }),
    RedisModule.forRootAsync({
      name: conn2,
      useFactory: () => ({
        connectUrl: connectionUrl2,
      }),
    }),
    PingModule,
  ],
})
export class AppModule {}
