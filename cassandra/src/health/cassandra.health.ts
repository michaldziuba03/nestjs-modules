import { Injectable } from "@nestjs/common";
import { Client } from "cassandra-driver";
import { HealthIndicator } from '@nestjs/terminus';

@Injectable()
export class CassandraHealthIndicator extends HealthIndicator {
  async pingDb(key: string, client: Client) {
    try {
      const query = "SELECT release_version FROM system.local";
      const result = await client.execute(query);

      const isHealth = result.first() && typeof result.first().release_version === 'string';
      return this.getStatus(key, isHealth);

    } catch (err) {
      return this.handleErrorMessage(key, err);
    }
  }

  handleErrorMessage(key: string, err: unknown) {
    if (err instanceof Error) {
      return this.getStatus(key, false, { message: err.message });
    }

    return this.getStatus(key, false);
  }
}

