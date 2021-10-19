import { Controller, Get } from "@nestjs/common";
import { HealthCheck, HealthCheckService } from "@nestjs/terminus";
import { Client } from "cassandra-driver";
import { InjectCassandra } from "../src";
import { CassandraHealthIndicator } from "../src/health";

@Controller('health')
export class HealthController {
  constructor(
    @InjectCassandra('health')
    private readonly cassandraClient: Client,
    private readonly cassandra: CassandraHealthIndicator,
    private readonly health: HealthCheckService,
  ) { }

  @HealthCheck()
  @Get()
  checkHealth() {
    return this.health.check([
      async () => this.cassandra.pingDb('cassandra', this.cassandraClient),
    ]);
  }
}
