import { Module } from '@nestjs/common';
import { ClickHouseModule, ClickHouseOptionsFactory } from '../../lib';
import { options } from './options';
import { PingModule } from './ping/ping.module';

class ConfigService implements ClickHouseOptionsFactory {
  createClickHouseOptions() {
    return {
      host: options.host2,
      username: options.user,
      password: options.password,
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
    ClickHouseModule.forRoot({
      host: options.host1,
      username: options.user,
      password: options.password,
    }),
    ClickHouseModule.forRootAsync({
      name: options.name2,
      imports: [ConfigModule],
      useExisting: ConfigService,
    }),
    PingModule,
  ],
})
export class AsyncExistingModule {}
