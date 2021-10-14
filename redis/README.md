<p align="center">
  <img src="https://user-images.githubusercontent.com/43048524/136818357-bcc8e3b9-0e28-4a9c-ad3d-e90a6de78713.png" width="320" alt="Nest Redis Logo" />
</p>

## Nest.js Redis module (in development)
Redis module based on npm library `ioredis`.

#### Features:
- Simple codebase
- Graceful shutdown
- Multiple connections
- Cluster module (in development and not tested yet)
- Simple lifecycle hooks (`onReady`, `beforeShutdown`)

### Installation
#### npm
```bash
npm install @mich4l/nestjs-redis
```

#### Yarn
```bash
yarn add @mich4l/nestjs-redis
```

### Example
`app.module.ts`
```ts
@Module({
  imports: [
    RedisModule.register({
      name: 'conn1',
      host: 'localhost',
      port: 6379,
    })
  controllers: [],
  providers: [],
})
export class AppModule {}
```

`example.service.ts`
```ts
import { Inject, Injectable } from '@nestjs/common';
import { InjectCassandra } from '@mich4l/nestjs-redis';
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
    RedisModule.register({
      name: 'conn1',
      host: 'localhost',
      port: 6379,
    }),
    RedisModule.register({
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

### Lifecycle hooks
```ts
@Module({
  imports: [
    RedisModule.register({
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
  ]
  controllers: [],
  providers: [],
})
export class AppModule {}
```