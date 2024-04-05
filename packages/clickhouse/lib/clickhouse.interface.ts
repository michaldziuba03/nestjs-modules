import { ASYNC_OPTIONS_TYPE } from './clickhouse-base.module';
import type { ClickHouseClientConfigOptions } from '@clickhouse/client';

export type ClickHouseOptions = ClickHouseClientConfigOptions & {
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
