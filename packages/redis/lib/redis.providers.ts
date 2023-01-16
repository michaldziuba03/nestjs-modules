import { Provider, Type } from '@nestjs/common';
import { REDIS_OPTIONS, REDIS_TOKEN } from './redis.constants';
import {
  RedisModuleOptions,
  RedisModuleAsyncOptions,
  RedisOptionsFactory,
} from './redis.interface';
import { createClient, getConnectionToken } from './redis.utils';

export function createTokenProvider(token: string): Provider {
  return {
    provide: REDIS_TOKEN,
    useValue: token,
  };
}

export function createClientProvider(token: string): Provider {
  return {
    provide: getConnectionToken(token),
    inject: [REDIS_OPTIONS],
    useFactory: createClient,
  };
}

export function createOptionsProvider(options: RedisModuleOptions): Provider {
  return {
    provide: REDIS_OPTIONS,
    useValue: options,
  };
}

export function createAsyncProviders(
  options: RedisModuleAsyncOptions,
): Provider[] {
  if (options.useExisting || options.useFactory) {
    return [createOptionsAsyncProvider(options)];
  }

  const useClass = options.useClass as Type<RedisOptionsFactory>;
  return [
    createOptionsAsyncProvider(options),
    {
      useClass,
      provide: useClass,
    },
  ];
}

export function createOptionsAsyncProvider(
  options: RedisModuleAsyncOptions,
): Provider {
  if (options.useFactory) {
    return {
      provide: REDIS_OPTIONS,
      inject: options.inject || [],
      useFactory: options.useFactory,
    };
  }

  const inject = [
    (options.useClass || options.useExisting) as Type<RedisOptionsFactory>,
  ];

  return {
    provide: REDIS_OPTIONS,
    inject,
    useFactory: async (factory: RedisOptionsFactory) =>
      await factory.createRedisOptions(options.name),
  };
}
