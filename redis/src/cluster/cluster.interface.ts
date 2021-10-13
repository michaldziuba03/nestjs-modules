import { ModuleMetadata } from "@nestjs/common";
import { Cluster, ClusterNode, ClusterOptions } from "ioredis";

export interface IORedisClusterOptions {
    options?: ClusterOptions,
    nodes: ClusterNode[],
    onReady?: (cluster: Cluster) => any | Promise<any>;
    beforeShutdown?: (cluster: Cluster) => any | Promise<any>;
}

export interface ClusterModuleOptions extends IORedisClusterOptions {
    clusterToken?: string;
}

export interface ClusterModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory: (...args: any) => IORedisClusterOptions | Promise<IORedisClusterOptions>;
    inject?: any[];
    clusterToken?: string;
}