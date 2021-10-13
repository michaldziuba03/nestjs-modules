import { Logger } from "@nestjs/common";
import IORedis from "ioredis";
import { DuplicationError } from "src/errors/DuplicationError";
import { CLUSTER_BASE, CLUSTER_DEFAULT_TOKEN } from "./cluster.constants";
import { IORedisClusterOptions } from "./cluster.interface";

const tokens: string[] = []
export function validateClusterToken(token: string = CLUSTER_DEFAULT_TOKEN) {
    if (tokens.includes(token)) {
        throw new DuplicationError('Cluster', token);
    }

    tokens.push(token);
}

export function createCluster(clusterOptions: IORedisClusterOptions) {
    const cluster = new IORedis.Cluster(clusterOptions.nodes, clusterOptions.options);
    if (clusterOptions.onReady) {
        clusterOptions.onReady(cluster);
    }
    
    return cluster;
}

export const createClusterToken = (clusterToken: string) => {
    return `${CLUSTER_BASE}${clusterToken}`;
}

export const logger = new Logger('RedisClusterModule');