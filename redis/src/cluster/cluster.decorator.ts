import { Inject } from "@nestjs/common";
import { createClusterToken } from "./cluster.utils";

export const InjectRedisCluster = (clusterToken?: string) => {
  const token = createClusterToken(clusterToken);
  return Inject(token);
};

export const injectClusterToken = (clusterToken?: string) =>
  createClusterToken(clusterToken);
