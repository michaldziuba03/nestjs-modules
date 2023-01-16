import { Injectable } from '@nestjs/common';
import { Cluster } from 'ioredis';

Injectable();
export class PingService {
  constructor(private readonly cluster: Cluster) {}

  async getPong() {
    const pong = await this.cluster.ping();
    return { pong };
  }
}
