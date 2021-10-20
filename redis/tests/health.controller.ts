import { Controller, Get } from "@nestjs/common";
import { HealthCheck, HealthCheckService } from "@nestjs/terminus";
import { InjectRedis } from "dist";
import { RedisHealthIndicator } from "../src/health";
import { Redis } from "ioredis";

@Controller('health')
export class HealthController {
  constructor(
    @InjectRedis('health-test')
    private readonly redisClient: Redis,
    private readonly health: HealthCheckService,
    private readonly redis: RedisHealthIndicator,
  ) { }

  @HealthCheck()
  @Get()
  checkHealth() {
    return this.health.check([
      async () => this.redis.checkRedis('redis node', this.redisClient),
    ])
  }
}
