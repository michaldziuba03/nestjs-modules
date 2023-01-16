import { Injectable } from '@nestjs/common';
import { Cluster } from 'ioredis';
import { InjectRedisCluster } from '../../../../lib';

Injectable();
export class PingService {
  constructor(
    @InjectRedisCluster()
    private readonly cluster: Cluster,
  ) {}

  async getPong() {
    const pong = await this.cluster.ping();
    return { pong };
  }
}
