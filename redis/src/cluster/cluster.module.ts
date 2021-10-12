import { DynamicModule, Inject, OnApplicationShutdown, Provider } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { Cluster } from "ioredis";
import { shutdownClient } from "src/redis.utils";
import { CLUSTER_DEFAULT_TOKEN, CLUSTER_OPTIONS, CLUSTER_TOKEN } from "./cluster.constants";
import { ClusterModuleAsyncOptions, ClusterModuleOptions } from "./cluster.interface";
import { createCluster, createClusterToken, logger } from "./cluster.utils";

const tokens: string[] = [];

export class RedisClusterModule implements OnApplicationShutdown {
    constructor(
        @Inject(CLUSTER_TOKEN)
        private readonly token: string,
        private readonly moduleRef: ModuleRef,
    ) {}

    register(options: ClusterModuleOptions): DynamicModule {
        options.clusterToken = options.clusterToken || CLUSTER_DEFAULT_TOKEN;
        if (tokens.includes(options.clusterToken)) {
            throw new Error('Cluster tokens duplication!');
        }

        const tokenProvider: Provider = {
            provide: CLUSTER_TOKEN,
            useValue: options.clusterToken,
        }

        const optionsProvider: Provider = {
            provide: CLUSTER_OPTIONS,
            useValue: options.options,
        }

        const clusterProvider: Provider = {
            provide: createClusterToken(options.clusterToken),
            inject: [CLUSTER_OPTIONS],
            useFactory: createCluster,
        }

        return {
            module: RedisClusterModule,
            providers: [tokenProvider, optionsProvider],
            exports: [clusterProvider],
        }
    }

    registerAsync(options: ClusterModuleAsyncOptions): DynamicModule {
        options.clusterToken = options.clusterToken || CLUSTER_DEFAULT_TOKEN;
        if (tokens.includes(options.clusterToken)) {
            throw new Error('Cluster tokens duplication!');
        }

        const tokenProvider: Provider = {
            provide: CLUSTER_TOKEN,
            useValue: options.clusterToken,
        }

        const optionsProvider: Provider = {
            provide: CLUSTER_OPTIONS,
            useFactory: options.useFactory,
            inject: options.inject,
        }

        const clusterProvider: Provider = {
            provide: createClusterToken(options.clusterToken),
            inject: [CLUSTER_OPTIONS],
            useFactory: createCluster,
        }

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
            await shutdownClient(cluster);
            logger.log(`Closed connections for cluster:${this.token}`);
        }
    }
}