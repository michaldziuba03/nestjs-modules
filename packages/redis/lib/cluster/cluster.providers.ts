import { Provider, Type } from '@nestjs/common';
import { CLUSTER_OPTIONS, CLUSTER_TOKEN } from './cluster.constants';
import {
  ClusterModuleAsyncOptions,
  ClusterOptionsFactory,
  IORedisClusterOptions,
} from './cluster.interface';
import { createCluster, createClusterToken } from './cluster.utils';

export function createTokenProvider(token: string): Provider {
  return {
    provide: CLUSTER_TOKEN,
    useValue: token,
  };
}

export function createClusterProvider(token: string): Provider {
  return {
    provide: createClusterToken(token),
    inject: [CLUSTER_OPTIONS],
    useFactory: createCluster,
  };
}

export function createOptionsProvider(
  options: IORedisClusterOptions,
): Provider {
  return {
    provide: CLUSTER_OPTIONS,
    useValue: options,
  };
}

export function createAyncProviders(
  options: ClusterModuleAsyncOptions,
): Provider[] {
  if (options.useFactory || options.useExisting) {
    return [createOptionsAsyncProvider(options)];
  }

  const useClass = options.useClass as Type<ClusterOptionsFactory>;
  return [
    createOptionsAsyncProvider(options),
    {
      useClass,
      provide: useClass,
    },
  ];
}

function createOptionsAsyncProvider(
  options: ClusterModuleAsyncOptions,
): Provider {
  if (options.useFactory) {
    return {
      provide: CLUSTER_OPTIONS,
      inject: options.inject || [],
      useFactory: options.useFactory,
    };
  }

  const inject = [
    (options.useClass || options.useExisting) as Type<ClusterOptionsFactory>,
  ];

  return {
    provide: CLUSTER_OPTIONS,
    inject,
    useFactory: async (factory: ClusterOptionsFactory) =>
      await factory.createClusterOptions(options.clusterToken),
  };
}
