import { ModuleMetadata, Type } from '@nestjs/common';
import { Cluster, ClusterNode, ClusterOptions } from 'ioredis';

export interface IORedisClusterOptions {
  options?: ClusterOptions;
  nodes: ClusterNode[];
  onReady?: (cluster: Cluster) => any | Promise<any>;
  beforeShutdown?: (cluster: Cluster) => any | Promise<any>;
}

export interface ClusterModuleOptions extends IORedisClusterOptions {
  isGlobal?: boolean;
  clusterToken?: string;
}

export interface ClusterOptionsFactory {
  createClusterOptions: (
    clusterToken?: string,
  ) => IORedisClusterOptions | Promise<IORedisClusterOptions>;
}

export interface ClusterModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any
  ) => IORedisClusterOptions | Promise<IORedisClusterOptions>;
  useClass?: Type<ClusterOptionsFactory>;
  useExisting?: Type<ClusterOptionsFactory>;
  inject?: any[];
  clusterToken?: string;
  isGlobal?: boolean;
}
