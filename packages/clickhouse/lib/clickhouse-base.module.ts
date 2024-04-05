import { ConfigurableModuleBuilder } from '@nestjs/common';
import type { BaseClickHouseClientConfigOptions } from '@clickhouse/client';

// use ConfigurableModuleBuilder to skip most annoying part in building modules
export const {
  ConfigurableModuleClass: ClickhouseBaseModule,
  MODULE_OPTIONS_TOKEN: CLICKHOUSE_OPTIONS,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<BaseClickHouseClientConfigOptions>()
  .setClassMethodName('forRoot')
  .setFactoryMethodName('createClickHouseOptions')
  .setExtras(
    {
      isGlobal: true,
    },
    (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    }),
  )
  .build();
