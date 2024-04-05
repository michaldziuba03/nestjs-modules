import { Injectable } from '@nestjs/common';
import { InjectClickHouse } from '../../../lib';
import type { ClickHouseClient } from '@clickhouse/client';
import { options } from '../options';

@Injectable()
export class PingService {
  constructor(
    @InjectClickHouse()
    private readonly client1: ClickHouseClient,
    @InjectClickHouse(options.name2)
    private readonly client2: ClickHouseClient,
  ) {}

  async ping(): Promise<boolean> {
    const ping1 = await this.client1.ping();
    const ping2 = await this.client2.ping();

    return ping1.success && ping2.success;
  }
}
