import { ModuleMetadata } from "@nestjs/common";
import { Redis, RedisOptions } from "ioredis";

export interface RedisModuleOptions extends RedisOptions {
  name?: string;
  isGlobal?: boolean;
  onReady?: (client: Redis) => any | Promise<any>;
  beforeShutdown?: (client: Redis) => any | Promise<any>;
}

type RedisModuleOptionsExclude = Omit<RedisModuleOptions, "isGlobal">;

export interface RedisModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  useFactory: (
    ...args: any
  ) => RedisModuleOptionsExclude | Promise<RedisModuleOptionsExclude>;
  inject?: any[];
  name?: string;
  isGlobal?: boolean;
}
