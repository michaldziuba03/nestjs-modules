import { Provider } from '@nestjs/common';
import { CLUSTER_OPTIONS, CLUSTER_TOKEN } from './cluster.constants';
import {
  ClusterModuleAsyncOptions,
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

export function createOptionsAsyncProvider(
  options: ClusterModuleAsyncOptions,
): Provider {
  return {
    provide: CLUSTER_OPTIONS,
    useFactory: options.useFactory,
    inject: options.inject,
  };
}
