import { Inject } from "@nestjs/common";
import { CLUSTER_DEFAULT_TOKEN } from "./cluster.constants";
import { createClusterToken } from "./cluster.utils";

export const InjectRedisCluster = (clusterToken: string) => {
    const token = createClusterToken(clusterToken);
    return Inject(token)
};

export const injectClusterToken = (clusterToken: string = CLUSTER_DEFAULT_TOKEN) => createClusterToken(clusterToken);
