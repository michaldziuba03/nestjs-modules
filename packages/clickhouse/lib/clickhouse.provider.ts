import { Provider } from '@nestjs/common';
import { CLICKHOUSE_OPTIONS, CLICKHOUSE_TOKEN } from './clickhouse.constants';
import { createClient } from '@clickhouse/client';
import { getConnectionToken, logger } from './clickhouse.utils';

export function createTokenProvider(name: string): Provider {
  return {
    provide: CLICKHOUSE_TOKEN,
    useValue: name,
  };
}

export function createClientProvider(name: string): Provider {
  return {
    inject: [CLICKHOUSE_OPTIONS],
    provide: getConnectionToken(name),
    useFactory: (options) => {
      logger.log(`ClickHouse client instance is ready`);

      return createClient(options);
    },
  };
}
