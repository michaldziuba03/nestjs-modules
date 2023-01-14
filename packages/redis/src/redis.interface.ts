import { ModuleMetadata } from "@nestjs/common";
import { Redis, RedisOptions } from "ioredis";

// options related to ioredis instance creation
export interface IORedisOptions extends RedisOptions {
  connectUrl?: string;
  onReady?: (client: Redis) => any | Promise<any>;
  beforeShutdown?: (client: Redis) => any | Promise<any>;
}

// options related to RedisModule creation:
export interface RedisModuleOptions extends IORedisOptions {
  name?: string;
  isGlobal?: boolean;
}

export interface RedisModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  useFactory: (...args: any) => IORedisOptions | Promise<IORedisOptions>;
  inject?: any[];
  name?: string;
  isGlobal?: boolean;
}
