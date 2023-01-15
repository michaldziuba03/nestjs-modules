import {
  Module,
  OnApplicationShutdown,
  DynamicModule,
  Inject,
} from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { Redis } from "ioredis";
import { shutdownClient } from "./common/common.utils";
import { REDIS_OPTIONS, REDIS_TOKEN } from "./redis.constants";
import { RedisModuleOptions, RedisModuleAsyncOptions } from "./redis.interface";
import {
  createAsyncProviders,
  createClientProvider,
  createOptionsAsyncProvider,
  createOptionsProvider,
  createTokenProvider,
} from "./redis.providers";
import {
  getConnectionToken,
  logger,
  validateRedisToken,
  valueOrDefault,
} from "./redis.utils";

@Module({})
export class RedisModule implements OnApplicationShutdown {
  constructor(
    private readonly moduleRef: ModuleRef,
    @Inject(REDIS_TOKEN)
    private readonly clientToken: string,
    @Inject(REDIS_OPTIONS)
    private readonly clientOptions: RedisModuleOptions
  ) {}

  static forRoot(options: RedisModuleOptions): DynamicModule {
    const token = validateRedisToken(options.name);
    const clientToken = createTokenProvider(token);
    const clientOptions = createOptionsProvider(options);
    const clientProvider = createClientProvider(token);

    return {
      global: valueOrDefault(options.isGlobal, true),
      module: RedisModule,
      providers: [clientToken, clientOptions, clientProvider],
      exports: [clientProvider],
    };
  }

  static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    const token = validateRedisToken(options.name);
    const clientToken = createTokenProvider(token);
    const clientProvider = createClientProvider(token);
    const asyncProviders = createAsyncProviders(options);

    return {
      global: valueOrDefault(options.isGlobal, true),
      module: RedisModule,
      imports: options.imports,
      providers: [clientToken, clientProvider, ...asyncProviders],
      exports: [clientProvider],
    };
  }

  async onApplicationShutdown() {
    const token = getConnectionToken(this.clientToken);
    const client = this.moduleRef.get<Redis>(token);

    if (client) {
      if (this.clientOptions.beforeShutdown) {
        await this.clientOptions.beforeShutdown(client);
      }

      logger.log(`Closing Redis connection: ${this.clientToken}`);
      await shutdownClient(client);
    }
  }
}
