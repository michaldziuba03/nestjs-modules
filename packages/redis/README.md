<p align="center">
  <img src="https://user-images.githubusercontent.com/43048524/136818357-bcc8e3b9-0e28-4a9c-ad3d-e90a6de78713.png" width="320" alt="Nest Redis Logo" />
</p>

## Nest.js Redis module
Redis module based on popular npm library `ioredis`.

#### Features:
- Simple codebase
- Graceful shutdown
- Multiple connections
- Cluster module
- Simple lifecycle hooks (`onReady`, `beforeShutdown`)

### Installation
#### pnpm
```bash
pnpm add @mich4l/nestjs-redis ioredis
```

#### npm
```bash
npm install --save @mich4l/nestjs-redis ioredis
```

#### Yarn
```bash
yarn add @mich4l/nestjs-redis ioredis
```

### Example
`app.module.ts`
```ts
@Module({
  imports: [
    RedisModule.forRoot({
      name: 'conn1',
      host: 'localhost',
      port: 6379,
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

#### Using URL
```ts
@Module({
  imports: [
    RedisModule.forRoot({
      connectUrl: "redis://localhost:6379",
    })
  ],
})
export class AppModule {}
```

`example.service.ts`
```ts
import { Inject, Injectable } from '@nestjs/common';
import { InjectRedis } from '@mich4l/nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class ExampleService {
    constructor(
        @InjectRedis('conn1')
        private readonly redis: Redis,
    ) {}

    async getAllPosts() {
        const key = 'posts';
        const result = await this.redis.get(key);

        return JSON.parse(result);
    }
}
```

### Multiple connections
`Note:` Every connection requires unique name!
```ts
@Module({
  imports: [
    RedisModule.forRoot({
      name: 'conn1',
      host: 'localhost',
      port: 6379,
    }),
    RedisModule.forRoot({
      name: 'conn2',
      host: 'localhost',
      port: 2137,
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

### Async named connections
Example with Nest.js config module:
```ts
...
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: ConfigSchema,
    }),
    RedisModule.forRootAsync({
      name: 'my-redis',
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        host: config.get('REDIS_HOST'),
        port: config.get('REDIS_PORT'),
      }),
      ...
    }),
})
export class AppModule {}
```

### Inject Redis client to `useFactory`
Example with Nest.js Throttler and Redis storage
```ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: ConfigSchema,
    }),
    RedisModule.forRootAsync({
      name: 'my-redis',
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        host: config.get('REDIS_HOST'),
        port: config.get('REDIS_PORT'),
      }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [injectRedisToken('my-redis')],
      useFactory: (redis: Redis) => ({
        storage: new ThrottlerStorageRedisService(redis),
      })
    })
  ]
})
export class AppModule {}
```


### Lifecycle hooks
```ts
@Module({
  imports: [
    RedisModule.forRoot({
      name: 'conn1',
      host: 'localhost',
      port: 6379,
      onReady: (client: Redis) => {
        client.on('error', handleError);
      },
      beforeShutdown: async (client: Redis) => {
        await client.flushall();
      }
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```
