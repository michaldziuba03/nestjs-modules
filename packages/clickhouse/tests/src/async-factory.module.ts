import { Module } from '@nestjs/common';
import { ClickHouseModule } from '../../lib';
import { options } from './options';
import { PingModule } from './ping/ping.module';

@Module({
  imports: [
    ClickHouseModule.forRoot({
      host: options.host1,
      username: options.user,
      password: options.password,
    }),
    ClickHouseModule.forRootAsync({
      name: options.name2,
      useFactory: () => ({
        host: options.host2,
        username: options.user,
        password: options.password,
      }),
    }),
    PingModule,
  ],
})
export class AsyncFactoryModule {}
