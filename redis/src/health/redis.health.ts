import { Injectable } from "@nestjs/common";
import { HealthIndicator } from '@nestjs/terminus';
import { Cluster, Redis } from "ioredis";

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  async checkRedis(key: string, client: Redis) {
    try {
      const pong = await client.ping();
      const isHealth = pong && pong === 'PONG';

      return this.getStatus(key, isHealth);
    } catch (err) {
      return this.handleErrorMessage(key, err);
    }
  }

  async checkCluster(key: string, client: Cluster) {
    try {
      const status = await client.cluster('info');
      const isHealth = status && typeof status === 'string' && status.includes('cluster_state:ok');

      return this.getStatus(key, isHealth);
    } catch (err) {
      return this.handleErrorMessage(key, err);
    }
  }

  private handleErrorMessage(key: string, err: unknown) {
    if (err instanceof Error) {
      return this.getStatus(key, false, { message: err.message, });
    }

    return this.getStatus(key, false);
  }
}
