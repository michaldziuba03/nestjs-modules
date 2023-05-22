import { ASYNC_OPTIONS_TYPE, OPTIONS_TYPE } from './clickhouse-base.module';
import { ClickHouseClientConfigOptions } from '@clickhouse/client';

export type ClickHouseOptions = typeof OPTIONS_TYPE & {
  name?: string;
};

export type ClickHouseAsyncOptions = typeof ASYNC_OPTIONS_TYPE & {
  name?: string;
};

export interface ClickHouseOptionsFactory {
  createClickHouseOptions: () =>
    | ClickHouseClientConfigOptions
    | Promise<ClickHouseClientConfigOptions>;
}
