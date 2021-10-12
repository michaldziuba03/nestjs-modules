import IORedis from "ioredis";
import { CLUSTER_BASE } from "./cluster.constants";
import { IORedisClusterOptions } from "./cluster.interface";

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