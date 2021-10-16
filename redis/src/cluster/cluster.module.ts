import { DynamicModule, Global, Inject, Module, OnApplicationShutdown } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { Cluster } from "ioredis";
import { shutdownClient } from "../common/common.utils";
import { CLUSTER_OPTIONS, CLUSTER_TOKEN } from "./cluster.constants";
import { ClusterModuleAsyncOptions, ClusterModuleOptions, IORedisClusterOptions } from "./cluster.interface";
import { createClusterProvider, createOptionsAsyncProvider, createOptionsProvider, createTokenProvider } from "./cluster.providers";
import { createClusterToken, logger, validateClusterToken } from "./cluster.utils";

@Global()
@Module({})
export class RedisClusterModule implements OnApplicationShutdown {
    constructor(
        @Inject(CLUSTER_TOKEN)
        private readonly token: string,
        @Inject(CLUSTER_OPTIONS)
        private readonly clusterOptions: IORedisClusterOptions,
        private readonly moduleRef: ModuleRef,
    ) {}

    static register(options: ClusterModuleOptions): DynamicModule {
        const token = validateClusterToken(options.clusterToken);
        const tokenProvider = createTokenProvider(token);
        const optionsProvider = createOptionsProvider(options);
        const clusterProvider = createClusterProvider(token);

        return {
            module: RedisClusterModule,
            providers: [tokenProvider, optionsProvider, clusterProvider],
            exports: [clusterProvider],
        }
    }

    static registerAsync(options: ClusterModuleAsyncOptions): DynamicModule {
        const token = validateClusterToken(options.clusterToken);
        const tokenProvider = createTokenProvider(token);
        const optionsProvider = createOptionsAsyncProvider(options);
        const clusterProvider = createClusterProvider(token);

        return {
            module: RedisClusterModule,
            imports: options.imports,
            providers: [tokenProvider, optionsProvider, clusterProvider],
            exports: [clusterProvider],
        }
    }

    async onApplicationShutdown() {
        const token = createClusterToken(this.token);
        const cluster = this.moduleRef.get<Cluster>(token);

        if (cluster) {
            if (this.clusterOptions.beforeShutdown) {
                await this.clusterOptions.beforeShutdown(cluster);
            }
            
            await shutdownClient(cluster);
            logger.log(`Closed connections for cluster: ${this.token}`);
        }
    }
}