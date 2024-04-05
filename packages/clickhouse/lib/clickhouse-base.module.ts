import { ConfigurableModuleBuilder } from '@nestjs/common';
import type { ClickHouseClientConfigOptions } from '@clickhouse/client';

// use ConfigurableModuleBuilder to skip most annoying part in building modules
export const {
  ConfigurableModuleClass: ClickhouseBaseModule,
  MODULE_OPTIONS_TOKEN: CLICKHOUSE_OPTIONS,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<ClickHouseClientConfigOptions>()
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
