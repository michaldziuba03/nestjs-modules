import { Module } from "@nestjs/common";
import { RedisHealthIndicator } from "./redis.health";

@Module({ 
    providers: [RedisHealthIndicator],
    exports: [RedisHealthIndicator],
})
export class RedisTerminusModule {}
