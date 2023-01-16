import { Provider, Type } from '@nestjs/common';
import { CASSANDRA_OPTIONS, CASSANDRA_TOKEN } from './cassandra.constants';
import {
  CassandraModuleAsyncOptions,
  CassandraModuleOptions,
  CassandraOptionsFactory,
} from './cassandra.interface';
import { createCassandraToken, createClient } from './cassandra.utils';

export function createTokenProvider(token: string): Provider {
  return {
    provide: CASSANDRA_TOKEN,
    useValue: token,
  };
}

export function createClientProvider(token?: string): Provider {
  return {
    provide: createCassandraToken(token),
    inject: [CASSANDRA_OPTIONS],
    useFactory: createClient,
  };
}

export function createCassandraOptions(
  options: CassandraModuleOptions,
): Provider {
  return {
    provide: CASSANDRA_OPTIONS,
    useValue: options,
  };
}

export function createCassandraAsyncProviders(
  options: CassandraModuleAsyncOptions,
): Provider[] {
  if (options.useFactory || options.useExisting) {
    return [createCassandraAsyncOptions(options)];
  }

  const useClass = options.useClass as Type<CassandraOptionsFactory>;
  return [
    createCassandraAsyncOptions(options),
    {
      provide: useClass,
      useClass,
    },
  ];
}

function createCassandraAsyncOptions(
  options: CassandraModuleAsyncOptions,
): Provider {
  if (options.useFactory) {
    return {
      provide: CASSANDRA_OPTIONS,
      inject: options.inject,
      useFactory: options.useFactory,
    };
  }

  const inject = [
    (options.useClass || options.useExisting) as Type<CassandraOptionsFactory>,
  ];

  return {
    provide: CASSANDRA_OPTIONS,
    inject,
    useFactory: async (factory: CassandraOptionsFactory) =>
      await factory.createCassandraOptions(options.clientName),
  };
}
