<p align="center">
  <img src="https://user-images.githubusercontent.com/43048524/136818357-bcc8e3b9-0e28-4a9c-ad3d-e90a6de78713.png" width="320" alt="Nest Redis Logo" />
</p>

## Redis module for Nest.js
Redis module based on popular npm library `ioredis`.

#### Features:
- Simple codebase
- Graceful shutdown
- Multiple connections
- Cluster module
- Simple lifecycle hooks (`onReady`, `beforeShutdown`)

### Installation
```bash
# pnpm:
pnpm add @mich4l/nestjs-redis ioredis
# npm:
npm install --save @mich4l/nestjs-redis ioredis
# yarn:
yarn add @mich4l/nestjs-redis ioredis
```

### Usage
#### Standard configuration
```ts
import { Module } from '@nestjs/common';
import { RedisModule } from '@mich4l/nestjs-redis';

@Module({
  imports: [
    RedisModule.forRoot({
      host: 'localhost',
      port: 6379,        
    })
  ]
})
export class AppModule {}
```

#### Async configuration with useFactory
```ts
import { Module } from '@nestjs/common';
import { RedisModule } from '@mich4l/nestjs-redis';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connectUrl: config.get<string>('REDIS_URL')
      })
    })
  ]
})
export class AppModule {}
```

#### Async configuration with useClass
```ts
import { Module } from '@nestjs/common';
import { 
  RedisOptionsFactory, 
  IORedisOptions, 
  RedisModule, 
} from '@mich4l/nestjs-redis';

@Injectable()
export class ConfigService implements RedisOptionsFactory {
  createRedisOptions(): IORedisOptions {
    return {
      connectUrl: 'redis://localhost:6379',
    };
  }
}

@Module({
  imports: [
    RedisModule.forRootAsync({
      useClass: ConfigService,
    })
  ]
})
export class AppModule {}
```

#### Async configuration with useExisting
```ts
@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useExisting: ConfigService,
    })
  ]
})
export class AppModule {}
```

### Example
Redis configuration

`app.module.ts`
```ts
@Module({
  imports: [
    RedisModule.forRoot({
      name: 'conn1',
      host: 'localhost',
      port: 6379,
    }),
    ExampleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

Injecting Redis client to service

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
  ]
})
export class AppModule {}
```

### Inject Redis client via token
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

### RedisModule is global by default
Set option `isGlobal` to `false` to change it.
```ts
@Module({
  imports: [
    RedisModule.forRoot({
      isGlobal: false,
      host: 'localhost',
      port: 6379,        
    })
  ]
})
export class AppModule {}
```


### Lifecycle hooks
You can use lifecycle hooks to handle errors.
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
})
export class AppModule {}
```
