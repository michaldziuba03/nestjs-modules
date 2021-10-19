import { Module } from "@nestjs/common";
import { CassandraHealthIndicator } from './cassandra.health';

@Module({
  providers: [CassandraHealthIndicator],
  exports: [CassandraHealthIndicator],
})
export class CassandraTerminusModule { }

