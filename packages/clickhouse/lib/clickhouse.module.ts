import { ClickhouseBaseModule } from './clickhouse-base.module';
import type { ClickHouseClient } from '@clickhouse/client';
import {
  ClickHouseAsyncOptions,
  ClickHouseOptions,
} from './clickhouse.interface';
import {
  getConnectionToken,
  logger,
  validateConnectionName,
} from './clickhouse.utils';
import {
  createClientProvider,
  createTokenProvider,
} from './clickhouse.provider';
import { Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CLICKHOUSE_TOKEN } from './clickhouse.constants';

@Module({})
export class ClickHouseModule
  extends ClickhouseBaseModule
  implements OnApplicationShutdown
{
  constructor(
    private readonly moduleRef: ModuleRef,
    @Inject(CLICKHOUSE_TOKEN)
    private readonly clientToken: string,
  ) {
    super();
  }

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

  async onApplicationShutdown() {
    const token = getConnectionToken(this.clientToken);
    const client = this.moduleRef.get<ClickHouseClient>(token);
    logger.log(`Closing ClickHouse client: ${this.clientToken}...`);
    await client.close();
  }
}
