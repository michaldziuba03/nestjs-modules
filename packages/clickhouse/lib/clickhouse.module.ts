import { ClickhouseBaseModule } from './clickhouse-base.module';
import {
  ClickHouseAsyncOptions,
  ClickHouseOptions,
} from './clickhouse.interface';
import { validateConnectionName } from './clickhouse.utils';
import {
  createClientProvider,
  createTokenProvider,
} from './clickhouse.provider';
import { Module } from '@nestjs/common';

@Module({})
export class ClickHouseModule extends ClickhouseBaseModule {
  static forRoot(options: ClickHouseOptions) {
    const token = validateConnectionName(options.name);
    const tokenProvider = createTokenProvider(token);
    const clientProvider = createClientProvider(token);

    const module = super.forRoot(options);
    module.providers.push(tokenProvider, clientProvider);
    module.exports = [clientProvider];

    return module;
  }

  static forRootAsync(options: ClickHouseAsyncOptions) {
    const token = validateConnectionName(options.name);
    const tokenProvider = createTokenProvider(token);
    const clientProvider = createClientProvider(token);

    const module = super.forRootAsync(options);
    module.providers.push(tokenProvider, clientProvider);
    module.exports = [clientProvider];

    return module;
  }
}
